/*
 * ==============================================================================
 * SMART SOLARGUARD: ESP32 Solar Panel IoT Monitoring Client
 * ==============================================================================
 * Project: IoT-Based Solar Panel Fault Detection using Deep Neural Network (DNN)
 * Author: Smart SolarGuard Team
 * Target Hardware: ESP32 Development Board (ESP-WROOM-32)
 *
 * SENSOR CONNECTIONS & PINOUT GUIDE:
 * ------------------------------------------------------------------------------
 * 1. Voltage Sensor (Voltage Divider 0-25V module):
 *    - VCC / S: Connect to ESP32 Pin GPIO34 (ADC1_CH6 - Input only)
 *    - GND: Connect to Common GND
 *    - Input Terminals: Connected across Solar Panel (+) and (-) terminals
 *    - Voltage ratio: 5:1 divider (R1=30k, R2=7.5k). 25V maps to 0-3.3V ADC.
 *
 * 2. Current Sensor (ACS712-05B / 20A / 30A Current Sensor):
 *    - VCC: Connect to 5V (from USB or external 5V regulator)
 *    - GND: Connect to Common GND
 *    - OUT: Connect to ESP32 Pin GPIO35 (ADC1_CH7) via voltage divider (ACS712 5V logic to 3.3V ESP32)
 *    - Input IP+/IP-: In-series with Solar Panel positive load line.
 *
 * 3. Light Intensity Sensor (LDR Module / Photoresistor):
 *    - VCC: Connect to 3.3V
 *    - GND: Connect to Common GND
 *    - Analog Out (AO): Connect to ESP32 Pin GPIO32 (ADC1_CH4)
 *
 * 4. Temperature Sensor (LM35 Analog or DS18B20 OneWire):
 *    - VCC: Connect to 3.3V
 *    - GND: Connect to Common GND
 *    - OUT: Connect to ESP32 Pin GPIO33 (ADC1_CH5)
 *
 * 5. Status Indicator LEDs (Optional):
 *    - Built-in LED / GPIO2: Blinks on successful telemetry transmission
 * ==============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // ArduinoJson library v6+

// ------------------------------------------------------------------------------
// 1. NETWORK CONFIGURATION (Replace with your actual Wi-Fi credentials)
// ------------------------------------------------------------------------------
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Replace with your laptop/server IP address running the FastAPI backend.
// Note: Do NOT use "localhost" or "127.0.0.1" inside ESP32. Use the local LAN IP (e.g. 192.168.1.50)
const char* SERVER_URL    = "http://192.168.1.100:8000/api/sensors";

// Unique hardware identifier
const char* DEVICE_ID     = "ESP32-SOLAR-001";

// ------------------------------------------------------------------------------
// 2. PIN DEFINITIONS
// ------------------------------------------------------------------------------
#define PIN_VOLTAGE     34  // ADC1 Channel 6
#define PIN_CURRENT     35  // ADC1 Channel 7
#define PIN_LDR         32  // ADC1 Channel 4
#define PIN_TEMP        33  // ADC1 Channel 5
#define PIN_STATUS_LED  2   // Onboard Blue LED

// ------------------------------------------------------------------------------
// 3. HARDWARE & CALIBRATION CONSTANTS
// ------------------------------------------------------------------------------
const float ADC_RESOLUTION  = 4095.0;  // 12-bit ADC on ESP32
const float VREF            = 3.3;     // ESP32 ADC Reference Voltage (V)

// Voltage divider ratio: R1 = 30k, R2 = 7.5k -> Factor = (30+7.5)/7.5 = 5.0
const float VOLTAGE_DIVIDER_FACTOR = 5.0;

// Current Sensor (ACS712 5A model sensitivity = 185mV/A, midpoint = 2.5V)
const float CURRENT_SENSITIVITY    = 0.185; // Volts per Amp
const float ACS_OFFSET             = 2.5;   // Zero-current voltage offset

// Telemetry interval (in milliseconds)
const unsigned long TRANSMIT_INTERVAL = 3000; // Send telemetry every 3 seconds
unsigned long lastTransmitTime = 0;

// Set to true if physical sensors are not wired and you want the ESP32 itself to simulate values
bool HARDWARE_SIMULATION_MODE = false;

// ------------------------------------------------------------------------------
// SETUP
// ------------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==================================================");
  Serial.println("   SMART SOLARGUARD: ESP32 SOLAR MONITOR INIT    ");
  Serial.println("==================================================");

  // Configure pins
  pinMode(PIN_VOLTAGE, INPUT);
  pinMode(PIN_CURRENT, INPUT);
  pinMode(PIN_LDR, INPUT);
  pinMode(PIN_TEMP, INPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);
  digitalWrite(PIN_STATUS_LED, LOW);

  // Connect to Local Wi-Fi
  Serial.printf("Connecting to Wi-Fi SSID: %s\n", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[OK] Wi-Fi Connected!");
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Target API Server: ");
    Serial.println(SERVER_URL);
  } else {
    Serial.println("\n[WARNING] Wi-Fi Connection Timeout!");
    Serial.println("Running in Standalone mode. Check credentials and reboot.");
  }
}

// ------------------------------------------------------------------------------
// SENSOR READING & CALIBRATION ROUTINES
// ------------------------------------------------------------------------------

// Read Voltage across solar panel terminals (Volts)
float readVoltage() {
  if (HARDWARE_SIMULATION_MODE) {
    // Generate realistic solar voltage (18V to 20V with slight ripple)
    return 18.5 + ((random(-50, 50)) / 100.0);
  }
  
  // Multiple sampling for ADC noise rejection
  long rawSum = 0;
  for (int i = 0; i < 16; i++) {
    rawSum += analogRead(PIN_VOLTAGE);
    delayMicroseconds(200);
  }
  float avgRaw = (float)rawSum / 16.0;
  float pinVoltage = (avgRaw / ADC_RESOLUTION) * VREF;
  float panelVoltage = pinVoltage * VOLTAGE_DIVIDER_FACTOR;
  
  if (panelVoltage < 0.1) panelVoltage = 0.0;
  return panelVoltage;
}

// Read Current flowing through solar panel circuit (Amperes)
float readCurrent() {
  if (HARDWARE_SIMULATION_MODE) {
    // Generate realistic solar current (1.8A to 2.3A)
    return 2.10 + ((random(-30, 30)) / 100.0);
  }

  long rawSum = 0;
  for (int i = 0; i < 16; i++) {
    rawSum += analogRead(PIN_CURRENT);
    delayMicroseconds(200);
  }
  float avgRaw = (float)rawSum / 16.0;
  float pinVoltage = (avgRaw / ADC_RESOLUTION) * VREF;
  
  // Calculate current based on ACS712 sensitivity
  float current = (pinVoltage - (ACS_OFFSET * (3.3 / 5.0))) / CURRENT_SENSITIVITY;
  if (current < 0.05) current = 0.0;
  return current;
}

// Read Solar Panel Surface Temperature (°C)
float readTemperature() {
  if (HARDWARE_SIMULATION_MODE) {
    // Realistic outdoor temperature: 28°C - 35°C
    return 31.5 + ((random(-20, 20)) / 10.0);
  }

  int raw = analogRead(PIN_TEMP);
  float voltage = (raw / ADC_RESOLUTION) * VREF;
  // LM35 conversion: 10mV = 1°C -> Temp = Voltage * 100
  float temperatureC = voltage * 100.0;
  return temperatureC;
}

// Read Solar Light Intensity / Solar Irradiance (Lux / lx)
float readLightIntensity() {
  if (HARDWARE_SIMULATION_MODE) {
    // Realistic daytime sunlight: 750 - 950 Lux
    return 850.0 + random(-80, 80);
  }

  int raw = analogRead(PIN_LDR);
  // Invert because higher light yields lower resistance in voltage divider
  float lightPercent = (1.0 - (raw / ADC_RESOLUTION)) * 100.0;
  float luxEstimate = lightPercent * 10.0; // Scaled to ~0-1000 Lux
  return luxEstimate;
}

// ------------------------------------------------------------------------------
// SEND TELEMETRY VIA REST API TO FASTAPI
// ------------------------------------------------------------------------------
void sendTelemetry(float voltage, float current, float temperature, float light) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] Cannot send telemetry: Wi-Fi Disconnected");
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  // Construct JSON Payload
  // Note: Backend automatically validates and calculates: power = voltage * current
  StaticJsonDocument<256> doc;
  doc["voltage"] = round(voltage * 100.0) / 100.0;
  doc["current"] = round(current * 100.0) / 100.0;
  doc["temperature"] = round(temperature * 10.0) / 10.0;
  doc["light_intensity"] = round(light * 10.0) / 10.0;
  doc["device_id"] = DEVICE_ID;

  String requestBody;
  serializeJson(doc, requestBody);

  Serial.printf("\n[TX] POST to %s\n", SERVER_URL);
  Serial.printf("     Payload: %s\n", requestBody.c_str());

  digitalWrite(PIN_STATUS_LED, HIGH);
  int httpResponseCode = http.POST(requestBody);
  digitalWrite(PIN_STATUS_LED, LOW);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("[RX] Response (%d): %s\n", httpResponseCode, response.c_str());
  } else {
    Serial.printf("[ERROR] HTTP Request failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

// ------------------------------------------------------------------------------
// MAIN LOOP
// ------------------------------------------------------------------------------
void loop() {
  unsigned long currentMillis = millis();

  // Periodic sensor sampling and transmission
  if (currentMillis - lastTransmitTime >= TRANSMIT_INTERVAL) {
    lastTransmitTime = currentMillis;

    // 1. Read all sensors
    float v = readVoltage();
    float i = readCurrent();
    float t = readTemperature();
    float l = readLightIntensity();
    float p = v * i; // Power output (W)

    // 2. Output to Serial Monitor
    Serial.println("\n--- [Solar Panel Sensor Reading] ---");
    Serial.printf("Voltage:         %.2f V\n", v);
    Serial.printf("Current:         %.2f A\n", i);
    Serial.printf("Temperature:     %.1f C\n", t);
    Serial.printf("Light Intensity: %.1f lx\n", l);
    Serial.printf("Power Output:    %.2f W\n", p);

    // 3. Transmit to Smart SolarGuard FastAPI Backend
    sendTelemetry(v, i, t, l);
  }
}
