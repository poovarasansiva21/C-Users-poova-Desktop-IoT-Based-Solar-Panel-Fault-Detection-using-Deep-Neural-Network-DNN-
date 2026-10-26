# Smart SolarGuard: IoT-Based Solar Panel Fault Detection Using Deep Neural Network (DNN)

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/Animations-GSAP%203-88CE02.svg?style=flat&logo=greensock)](https://greensock.com/gsap/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB.svg?style=flat&logo=python)](https://python.org/)
[![Hardware](https://img.shields.io/badge/IoT-ESP32-E7352C.svg?style=flat&logo=espressif)](https://espressif.com/)

---

> **Project report:** See [PROJECT_REPORT.md](./PROJECT_REPORT.md) for the formal report, methodology, saved model results, and implementation limitations.

## 1. Project Overview

**Smart SolarGuard** is a full-stack, college-level AI + IoT solar photovoltaic monitoring and fault diagnosis platform. The system continuously ingests electrical and environmental telemetry (Voltage, Current, Temperature, Light Intensity, and calculated Power) from an edge ESP32 microcontroller or an onboard high-fidelity simulation engine. 

A trained **Deep Neural Network (DNN)** classifies solar panel conditions across six predefined states, calculates dashboard efficiency and estimated power loss, and triggers alerts. The current anomaly indicator is a heuristic based on scaled input values; the project does not currently load or run a trained Autoencoder.

---

## 2. Monitored Parameters & Fault Classification Matrix

### Sensor Telemetry
- **Voltage ($V$):** Terminal potential difference across panel load lines ($0 - 25\text{ V}$).
- **Current ($I$):** Loop current through the load circuit ($0 - 5\text{ A}$).
- **Temperature ($T$):** Surface PV cell temperature ($0 - 100\text{ }^\circ\text{C}$).
- **Light Intensity ($L$):** Solar irradiance incident on the panel ($0 - 1200\text{ lx}$).
- **Power Output ($P$):** Dynamic calculated power ($P = V \times I$ in Watts).

### 6 Fault Classes Detected by DNN
1. **NORMAL:** Healthy panel operating near Maximum Power Point (MPP $\approx 18.5\text{V}$, $2.1\text{A}$, $32^\circ\text{C}$, $850\text{ lx}$).
2. **SHADING:** Partial shadow (leaves, structures) causes bypass diodes to conduct, bottlenecking string current ($0.4 - 1.1\text{A}$).
3. **DUST / DIRTY:** High ambient light, but surface transmittance is reduced by dust, lowering current output by 20–35%.
4. **ELECTRICAL FAULT:** Severe voltage collapse or open circuit ($5 - 13\text{V}$) due to loose MC4 crimps or diode breakdown.
5. **LOW POWER:** Sub-optimal power output under adequate light indicating module degradation or impedance mismatch.
6. **OVERHEATING:** Thermal runaway or hotspot ($>55^\circ\text{C}$), causing sharp voltage drops via the silicon temperature coefficient.

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, GSAP 3 (with ScrollTrigger).
- **Backend:** Python 3.11, FastAPI, Uvicorn, Pydantic v2, SQLite3, SQLAlchemy ORM.
- **AI & Deep Learning:** Deep Neural Network (DNN) classifier, heuristic anomaly indicator, Scikit-learn, StandardScaler, NumPy, Pandas.
- **IoT Firmware:** ESP32 Arduino sketch (`hardware/esp32_solar_monitor.ino`) with multi-sampling ADC calibration and REST JSON serialization.

---

## 4. System Architecture

```
Solar Panel & Sensors (V, I, T, L)
             ↓
     ESP32 Microcontroller (or Software Simulation Twin)
             ↓  [HTTP REST POST /api/sensors]
     FastAPI Backend Gateway
             ↓
     StandardScaler Preprocessing (5-Dimensional Vector)
             ↓
   ┌─────────────────────────────────────────┐
   │ Deep Neural Network (DNN) Classifier    │
   │ Input(5) → Dense(64) → Dense(32) →      │
   │ Dense(16) → Dense(6, Softmax)           │
   └─────────────────────────────────────────┘
             ↓
   ┌─────────────────────────────────────────┐
   │ Heuristic Anomaly Indicator              │
   │ Scaled-input norm vs configured threshold│
   └─────────────────────────────────────────┘
             ↓
     SQLite Database (Readings, Predictions, Alerts, Devices)
             ↓  [REST Polling every 2–3s]
     React 18 Dashboard (GSAP Animations + Live Recharts)
```

---

## 5. Folder Structure

```
smart-solarguard/
├── backend/
│   ├── ai/
│   │   ├── predict.py           # Real-time inference engine & heuristic fallback
│   │   ├── preprocess.py        # StandardScaler, feature extraction, metadata
│   │   └── train_model.py       # DNN training and evaluation pipeline
│   ├── api/
│   │   └── router.py            # Complete FastAPI REST endpoint definitions
│   ├── data/
│   │   ├── generate_dataset.py  # Realistic physics-based solar dataset generator
│   │   └── solar_panel_dataset.csv
│   ├── database/
│   │   ├── connection.py        # SQLAlchemy SQLite engine & sessionmaker
│   │   └── models.py            # SensorReading, Prediction, Alert, Device models
│   ├── models/                  # Trained model artifacts & metrics
│   │   ├── model_metrics.json
│   │   └── scaler.pkl
│   ├── services/
│   │   └── simulation_service.py # Continuous background scenario simulator
│   ├── main.py                  # FastAPI server entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── animations/          # GSAP 3 animation suite
│   │   │   ├── gsapConfig.ts
│   │   │   ├── pageAnimations.ts
│   │   │   ├── scrollAnimations.ts
│   │   │   ├── dashboardAnimations.ts
│   │   │   └── aiAnimations.ts
│   │   ├── components/          # Reusable UI widgets
│   │   │   ├── AlertCard.tsx
│   │   │   ├── AutoencoderCard.tsx
│   │   │   ├── ConfusionMatrix.tsx
│   │   │   ├── DeviceStatus.tsx
│   │   │   ├── EfficiencyCard.tsx
│   │   │   ├── FaultBadge.tsx
│   │   │   ├── ModelArchitecture.tsx
│   │   │   ├── PredictionCard.tsx
│   │   │   ├── SensorCard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── Topbar.tsx
│   │   ├── pages/               # 11 Application pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LiveSensors.tsx
│   │   │   ├── AiDetection.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── SensorHistory.tsx
│   │   │   ├── FaultHistory.tsx
│   │   │   ├── IotDevices.tsx
│   │   │   ├── AiModel.tsx
│   │   │   ├── Alerts.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/
│   │   │   └── api.ts           # Type-safe API client
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript data contracts
│   │   ├── App.tsx              # Main routing & state controller
│   │   ├── index.css            # Tailwind & glassmorphism CSS
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── hardware/
│   └── esp32_solar_monitor.ino  # ESP32 C++ Arduino sketch & wiring docs
├── README.md                    # Project documentation
└── PROJECT_EXPLANATION.md       # Comprehensive Viva & Examination Guide
```

---

## 6. Installation & Setup Instructions

### Prerequisites
- **Python 3.10+** (Tested on Python 3.11)
- **Node.js 18+** (Tested on Node.js v24)
- **Git**

### Step 1: Backend Setup
Open a terminal in the project root:
```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (cmd):
.\venv\Scripts\activate.bat
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Dataset Generation & Model Training
Generate the synthetic physics dataset and train the Deep Neural Network:
```bash
# Generate 4,800 samples across 6 classes
python -m backend.data.generate_dataset

# Train DNN and evaluate metrics
python -m backend.ai.train_model
```

### Step 3: Start the Backend Server
```bash
# From project root with venv active:
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

---

### Step 4: Frontend Setup
Open a second terminal in the project root:
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
- Open browser at: `http://localhost:5173`

---

## 7. How to Demonstrate (Zero-Hardware Simulation Mode)

The system includes a **Virtual Twin Simulator** so the entire project can be demonstrated without physical hardware:

1. Open `http://localhost:5173`.
2. Notice the animated **Landing Page** with GSAP hero flow and ScrollTrigger sections.
3. Click **"Start Monitoring"** to enter the **Dashboard**.
4. The dashboard displays `SIMULATION MODE` with live numbers updating smoothly every 3 seconds.
5. In the **Simulation Mode & Fault Injector** panel:
   - Click **"SHADING"**: Voltage drops to ~15.5V, Current drops to ~0.8A, Power drops to ~12.4W.
   - Click **"Run AI Analysis"**: Observe the 5-step GSAP execution pipeline. The DNN classifies the fault as `SHADING` with ~94%+ confidence and provides cleaning/clearance recommendations.
   - Click **"ELECTRICAL_FAULT"**: Voltage collapses to ~8.5V, severe power loss is calculated, and a `CRITICAL` alert is generated.
   - Click **"OVERHEATING"**: Temperature spikes to >65°C, triggering hotspot warnings.
   - Click **"NORMAL"**: System returns to healthy MPP baseline ($18.5\text{V}$, $2.1\text{A}$, $38.8\text{W}$).
6. Navigate to **"Fault History"** to show the recorded audit log and estimated power loss.
7. Navigate to **"AI Model"** to present the DNN architecture, saved evaluation metrics, and anomaly indicator. The anomaly indicator is heuristic, not a trained Autoencoder.

---

## 8. Physical ESP32 Hardware Wiring Guide

When connecting physical hardware, flash `hardware/esp32_solar_monitor.ino` with the following pinout:

| Sensor Module | ESP32 Pin | Logic / Function |
| :--- | :--- | :--- |
| **Voltage Divider (0-25V)** | GPIO 34 (ADC1_CH6) | Measures panel terminal voltage (5:1 divider) |
| **ACS712-05B Current** | GPIO 35 (ADC1_CH7) | Measures load current (185 mV/A sensitivity) |
| **LM35 Temperature** | GPIO 33 (ADC1_CH5) | Measures surface cell temperature ($10\text{mV}/^\circ\text{C}$) |
| **LDR Photoresistor** | GPIO 32 (ADC1_CH4) | Measures relative solar irradiance (Lux) |
| **Status LED** | GPIO 2 | Blinks upon successful HTTP telemetry transmission |

---

## 9. API Reference Summary

- `GET /api/health` - System diagnostics and simulation state.
- `GET /api/sensors/latest` - Most recent sensor reading and predicted fault.
- `GET /api/sensors/history?range=5m|30m|1h|today` - Time-series points for charts.
- `POST /api/sensors` - Ingestion endpoint for ESP32 and simulator.
- `POST /api/predict` - Dedicated AI inference endpoint.
- `GET /api/alerts` - Active incident alerts and maintenance recommendations.
- `GET /api/faults` - Dedicated fault history with power loss calculation.
- `GET /api/model/metrics` - Accuracy, precision, recall, F1, confusion matrix, loss curves.
- `POST /api/simulation/generate` - On-demand fault scenario injection.
- `GET /api/devices` - Registered ESP32 devices and pin health.
