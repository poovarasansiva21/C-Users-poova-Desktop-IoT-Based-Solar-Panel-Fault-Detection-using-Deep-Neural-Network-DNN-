# Smart SolarGuard: IoT-Based Solar Panel Fault Detection Using Deep Neural Network

## Project Report

**Submitted by:** Poornima K  
**Register Number:** 711524BCS116  
**Course / Branch:** B.E. Computer Science and Engineering  
**Year / Semester:** III Year / V Semester  
**Institution:** Kalaignar Karunanidhi Institute of Technology (KIT), Coimbatore  
**Submission Date:** 23 October 2026

---

## Abstract

Solar panels operate outdoors and their electrical output can be affected by shading, dust, electrical problems, low power production, and excessive temperature. This project, **Smart SolarGuard**, combines an ESP32-based monitoring concept with a web application and a Deep Neural Network (DNN) classifier to identify six operating conditions: NORMAL, SHADING, DUST, ELECTRICAL_FAULT, LOW_POWER, and OVERHEATING.

The system uses voltage, current, temperature, and light-intensity readings as sensor inputs. The backend calculates power using \(P = V \times I\), standardizes the five model features, and runs the trained classifier. It stores readings, predictions, and alerts in SQLite and presents monitoring, history, analytics, device, and model information in a React dashboard. A background simulator generates readings for demonstration when physical ESP32 hardware is unavailable.

The model metrics currently stored with the project report 97.60% accuracy on a stratified 20% test split of a 4,800-row generated dataset. These are results on generated data, not a claim of equivalent accuracy on a deployed solar installation. Physical testing with calibrated sensors and independently collected panel data is needed to measure field performance.

## 1. Introduction

Solar photovoltaic output depends on operating and environmental conditions. Shading can reduce current, dust can reduce light reaching the cells, electrical problems can cause abnormal voltage and current, and high panel temperature can reduce output. A monitoring system that records several measurements and classifies the operating condition can help an operator decide what to inspect.

Smart SolarGuard demonstrates this workflow using an ESP32 firmware sketch, a FastAPI backend, a trained DNN model, SQLite storage, and a browser-based dashboard. It can receive telemetry from hardware or use simulated readings so that the software workflow can be demonstrated without a connected panel.

### 1.1 Project motivation

Checking panel condition manually can be time-consuming, while a single fixed threshold may not distinguish between different abnormal conditions. By considering voltage, current, temperature, light intensity, and derived power together, the project demonstrates multi-feature classification and provides a condition-specific maintenance recommendation.

## 2. Problem Statement

Solar panel measurements can change for several reasons, including low illumination, surface soiling, abnormal electrical behavior, and overheating. A monitoring solution should collect relevant measurements, retain a history, identify a likely operating condition, and communicate the result in a form that can be reviewed by an operator.

The project addresses this problem by implementing an IoT-to-dashboard pipeline that classifies readings into six predefined classes and records the resulting predictions and alerts.

## 3. Objectives

1. Collect panel voltage, current, temperature, and light-intensity readings through an ESP32 firmware design.
2. Calculate electrical power from voltage and current using \(P = V \times I\).
3. Classify readings into six predefined operating conditions using a DNN.
4. Store sensor readings, predictions, device information, and alerts in SQLite.
5. Display current status and historical information in a web dashboard.
6. Provide a simulation mode for testing and demonstrations without physical hardware.
7. Report model evaluation results together with the dataset and testing limitations.

## 4. Proposed System

The proposed system consists of four main parts:

| Part | Responsibility |
|---|---|
| Sensors and ESP32 | Measure panel voltage, current, temperature, and relative light level; send telemetry over Wi-Fi. |
| FastAPI backend | Validate incoming values, calculate power, run inference, and manage API requests. |
| DNN and preprocessing | Scale five features and classify the reading into one of six conditions. |
| SQLite and web dashboard | Persist readings, predictions, and alerts; present current status and historical views. |

The backend also runs a software simulation service that creates sample telemetry at regular intervals. This supports demonstration and interface testing but is not a substitute for measured hardware data.

## 5. Hardware and Measurements

The ESP32 sketch in `hardware/esp32_solar_monitor.ino` defines the following sensor connections:

| Component | ESP32 pin | Purpose |
|---|---:|---|
| Voltage divider module | GPIO 34 | Reads the panel voltage through a 5:1 divider. |
| ACS712 current sensor | GPIO 35 | Reads current; the sketch uses a nominal 185 mV/A sensitivity and a zero-current offset. |
| LDR / photoresistor | GPIO 32 | Produces a relative light-intensity estimate. |
| LM35 temperature sensor | GPIO 33 | Estimates temperature from analog voltage. |
| Status LED | GPIO 2 | Indicates a telemetry transmission. |

The firmware averages multiple ADC readings for voltage and current and sends a JSON request to the backend every three seconds when Wi-Fi is connected. Power is calculated as \(P = V \times I\). The backend independently calculates power from the received voltage and current.

**Measurement note:** The LDR conversion in the firmware is a scaled estimate, not a calibrated measurement of solar irradiance in lux. Sensor placement, calibration, electrical isolation, and safe panel wiring must be addressed before using the hardware with a real installation.

## 6. Dataset and Preprocessing

The repository contains `backend/data/solar_panel_dataset.csv`. The dataset-generation script creates six classes with 800 samples each (4,800 total), using programmed ranges and noise for voltage, current, temperature, and light intensity. Power is calculated for each generated sample as voltage multiplied by current.

The model uses these five input features:

| Feature | Unit | Use |
|---|---|---|
| Voltage | V | Electrical measurement |
| Current | A | Electrical measurement |
| Temperature | °C | Panel temperature measurement |
| Light intensity | lx estimate | Light-level input; calibration is not established by the project |
| Power | W | Derived as voltage multiplied by current |

Before training, the training code uses `StandardScaler`, fitting it on the training portion and transforming the test portion. The generated data is split with an 80/20 stratified random split and a fixed random seed. The saved metrics report 3,840 training samples and 960 test samples.

Because the current dataset is generated from class-specific value ranges, it does not establish how well the classifier will perform on varied real panels, weather, sensor noise, or unseen fault cases. Field evaluation should use independently collected data and a split that avoids leakage between closely related measurements.

## 7. System Architecture and Working Flow

```text
Solar panel and sensors
  (voltage, current, temperature, relative light)
                 |
                 v
       ESP32 firmware over Wi-Fi
                 |
                 v
      FastAPI POST /api/sensors
       validate and calculate P = V x I
                 |
        +--------+---------+
        |                  |
        v                  v
 StandardScaler        SQLite storage
        |          readings, predictions,
        v          devices, and alerts
   DNN prediction             |
        +---------------------+
                 |
                 v
     React + TypeScript dashboard
```

The main processing sequence is:

1. The ESP32 reads sensor values and sends them to the backend; alternatively, the simulator generates a sample reading.
2. The backend validates incoming sensor fields and calculates power from voltage and current.
3. The preprocessing module forms the five-feature input and applies the saved scaler.
4. The model returns class probabilities; the highest-probability class is selected as the prediction.
5. The backend saves the reading and prediction and updates the active alert state when a non-normal condition is detected.
6. The dashboard retrieves current readings, history, predictions, alerts, device status, and model information through the API.

## 8. Deep Neural Network

The model-training code defines a five-feature classifier with three dense hidden layers:

```text
Input: 5 features
Dense: 64 units, ReLU
Dropout: 0.20
Dense: 32 units, ReLU
Dropout: 0.20
Dense: 16 units, ReLU
Output: 6 units, Softmax
```

The Keras model is compiled with the Adam optimizer and sparse categorical cross-entropy loss. The training script runs for up to 35 epochs with a batch size of 32. It also has a Scikit-learn MLP fallback if Keras training is unavailable. The scaler and model artifacts are stored under `backend/models/`.

### 8.1 Fault classes

| Class | Meaning in the project |
|---|---|
| NORMAL | Measurements fall within the generated healthy-operation pattern. |
| SHADING | A lower light level and reduced output pattern associated with shading. |
| DUST | A generated pattern representing reduced output under relatively high light. |
| ELECTRICAL_FAULT | A generated abnormal voltage/current pattern. |
| LOW_POWER | A generated below-normal output pattern. |
| OVERHEATING | A generated high-temperature pattern with reduced voltage. |

These labels are categories represented in the generated training data; they should not be treated as definitive physical diagnoses without testing against real, labeled installations.

### 8.2 Anomaly indicator implementation

The project metadata describes an Autoencoder baseline, but the inference code currently does not load or execute a trained Autoencoder model. Instead, it calculates an anomaly indicator from the norm of the scaled input and compares that value with a threshold. This report therefore treats that output as a heuristic indicator, not as validated Autoencoder reconstruction error. Training and validating a real Autoencoder would be a future improvement.

## 9. Backend, Database, and Dashboard

The backend is built with FastAPI and exposes endpoints for health status, sensor ingestion, latest readings, sensor history, direct prediction, model information and metrics, alerts, fault history, devices, and simulation. The `/api/sensors` endpoint stores a reading and runs classification as part of telemetry ingestion.

SQLite stores four principal record types:

| Record | Stored information |
|---|---|
| Sensor reading | Timestamp, voltage, current, temperature, light estimate, power, and device ID |
| Prediction | Predicted class, confidence, severity, recommendation, and class probabilities |
| Alert | Fault type, severity, message, recommendation, status, and timestamp |
| Device | Device ID, connection status, IP address, and last-seen time |

The React and TypeScript frontend provides pages for the dashboard, live sensors, AI detection, analytics, sensor history, fault history, IoT devices, model details, alerts, settings, and the landing page. Reusable components display sensor values, predictions, alerts, model architecture, and system status.

## 10. Model Evaluation and Results

The values below are read from the repository's saved `backend/models/model_metrics.json`. They describe the saved evaluation on the generated dataset's 960-row test split.

| Metric | Saved result |
|---|---:|
| Accuracy | 97.60% |
| Weighted precision | 97.79% |
| Weighted recall | 97.60% |
| Weighted F1-score | 97.63% |

The saved confusion matrix shows most test examples classified correctly, with some confusion among SHADING, LOW_POWER, and ELECTRICAL_FAULT. These metrics should be presented as generated-dataset evaluation only. They do not establish real-world accuracy or performance on data collected after deployment.

For a stronger evaluation, collect labeled readings from the target hardware under varied lighting and temperature conditions, reserve a separate test period or installation, and report per-class precision, recall, F1-score, and the confusion matrix.

## 11. Benefits and Applications

- Provides a single dashboard for viewing sensor readings and predicted conditions.
- Demonstrates automated classification using multiple measurements rather than a single threshold.
- Retains readings, predictions, and alerts for review.
- Provides class-specific recommendations to guide inspection.
- Supports software demonstration through a built-in simulation service when hardware is not available.
- Uses a modular architecture that can be extended with calibrated sensors and field data.

## 12. Limitations

- The reported dataset is generated by code and is not a collection of measured solar-panel field data.
- The light reading is a relative LDR estimate and has not been shown to be calibrated in lux.
- The saved test metrics do not demonstrate generalization to different panels, installations, or weather conditions.
- The current anomaly indicator is heuristic; no trained Autoencoder inference is implemented.
- Simulation readings are useful for demonstrating software behavior but cannot validate physical sensor accuracy.
- Recommendations are advisory and should not replace electrical safety procedures or qualified inspection.

## 13. Future Enhancements

1. Collect and label real sensor data from multiple panels and operating conditions.
2. Calibrate the light sensor or add a suitable irradiance sensor and calibrate the electrical measurements.
3. Re-evaluate the classifier using independent field data and report per-class results.
4. Train and validate an actual Autoencoder if unknown-condition anomaly detection is required.
5. Add robust device authentication, secure transport, and deployment-specific network controls before remote use.
6. Add notification channels and configurable maintenance workflows for operators.

## 14. Conclusion

Smart SolarGuard demonstrates an end-to-end IoT and AI application for solar-panel condition monitoring. Its ESP32 firmware design and software simulator provide telemetry, the FastAPI backend calculates power and runs a six-class DNN classifier, SQLite records readings and alerts, and the React dashboard presents system status and history. The saved model evaluation reports 97.60% accuracy on generated test data. Further validation with calibrated sensors and independently collected real-panel data is necessary before making claims about operational field accuracy.

## References

1. Smart SolarGuard project source code: `backend/ai/`, `backend/api/`, `backend/data/`, `backend/database/`, `backend/services/`, `frontend/src/`, and `hardware/esp32_solar_monitor.ino`.
2. FastAPI documentation, https://fastapi.tiangolo.com/
3. Keras documentation, https://keras.io/
4. Scikit-learn `StandardScaler` documentation, https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html
5. Espressif ESP32 documentation, https://docs.espressif.com/projects/esp-idf/en/stable/esp32/
