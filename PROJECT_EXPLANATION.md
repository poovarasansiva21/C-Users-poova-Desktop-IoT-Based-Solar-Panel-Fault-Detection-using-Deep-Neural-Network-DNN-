# SMART SOLARGUARD: Comprehensive Project & Viva Guide

## IoT-Based Solar Panel Fault Detection Using Deep Neural Network (DNN)

---

## 1. How to Explain This Project in 2 Minutes (Elevator Pitch)

> *"Respected Examiners, my project is **Smart SolarGuard: IoT-Based Solar Panel Fault Detection using Deep Neural Networks**.*
> 
> *Solar photovoltaic panels are deployed in harsh outdoor environments where issues like **dust accumulation, partial shading, electrical connection failures, cell degradation, and thermal overheating** cause severe power losses and fire risks. Traditional solar installations rely on manual inspections or simple threshold alarms that cannot differentiate between dust, shadow, or serious wiring faults.*
> 
> *To solve this, I engineered an intelligent full-stack monitoring system. An **ESP32 microcontroller** measures five key operational parameters: **Voltage, Current, Temperature, Light Intensity, and calculated Power** ($P = V \times I$). This telemetry is streamed over Wi-Fi via a **FastAPI REST backend** to a **Deep Neural Network (DNN)**.*
> 
> *The DNN uses three dense hidden layers, two Dropout layers, and a Softmax output to classify readings into six predefined states: **Normal, Shading, Dust, Electrical Fault, Low Power, and Overheating**. The saved evaluation reports 97.60% accuracy on a generated dataset test split; this is not a field-accuracy claim. The project also displays a heuristic anomaly indicator, not a trained Autoencoder.*
> 
> *The results are presented on a high-performance **React + TypeScript web dashboard** featuring **GSAP-animated data flows**, real-time Recharts waveforms, dynamic efficiency ratio calculations, automatic alert dispatches, and an integrated **hardware simulation suite** that allows full verification without requiring physical solar arrays. Thank you."*

---

## 2. Problem Statement
Solar PV energy production suffers significantly from outdoor environmental degradation. Partial shading (from trees or buildings) creates localized current bottlenecks and dangerous hot spots. Dust accumulation forms a soiling layer that attenuates light transmission. Loose electrical joints or broken bypass diodes cause voltage collapses and fire hazards. 

Without automated, multi-parametric AI fault classification, maintenance teams cannot pinpoint whether an array requires surface cleaning, tree trimming, or urgent electrical rewiring.

---

## 3. Existing System vs Proposed System

| Feature | Existing System | Proposed Smart SolarGuard |
| :--- | :--- | :--- |
| **Monitoring Method** | Manual multimeter check or SCADA threshold | Continuous automated IoT edge sensing |
| **Fault Diagnosis** | Binary warning (working / not working) | 6-Class Deep Neural Network diagnosis |
| **Data Parameters** | Voltage or Power only | Multi-parametric ($V, I, T, L, P$) |
| **Novel Drift Detection**| None | Heuristic anomaly indicator based on scaled inputs |
| **Remediation Action**| Manual inspection required to find cause | Specific automated repair recommendations |
| **Visualization** | Basic tabular logs | Modern React + GSAP animated dashboard |
| **Hardware Independence** | Locked to physical setup | Built-in physical simulation twin |

---

## 4. System Objectives
1. Collect real-time electrical ($V, I, P$) and environmental ($T, L$) parameters from solar panels.
2. Ingest sensor telemetry using an ESP32 edge microcontroller via HTTP REST APIs.
3. Preprocess and normalize sensor features using `StandardScaler`.
4. Train a Deep Neural Network (DNN) capable of distinguishing 6 distinct operational states.
5. Provide a heuristic anomaly indicator alongside the supervised classifier.
6. Provide a web-based dashboard with smooth GSAP animations, time-series charts, and alerts.
7. Support a hardware simulation mode for offline demonstration and testing.

---

## 5. Hardware Specifications
- **Microcontroller:** ESP32 (32-bit dual-core, 240 MHz, Wi-Fi 802.11 b/g/n, 12-bit ADC).
- **Voltage Sensor:** Resistive Voltage Divider module (5:1 reduction, measures $0 - 25\text{V}$).
- **Current Sensor:** ACS712 Hall-effect current sensor ($185\text{ mV/A}$ sensitivity, measures $0 - 5\text{A}$).
- **Temperature Sensor:** LM35 precision analog sensor ($10\text{ mV}/^\circ\text{C}$, linear calibration).
- **Light Sensor:** Light Dependent Resistor (LDR) module in voltage divider configuration.
- **Solar PV Module:** 12V / 50W Monocrystalline test panel.

---

## 6. Software Stack & Rationale
- **Frontend (React 18 + TypeScript + Vite + Tailwind CSS):** Delivers a fast, type-safe, responsive user interface with glassmorphic cards and dark/light themes.
- **GSAP 3 & ScrollTrigger:** High-performance hardware-accelerated animations for page load, hero energy flows, numeric counters, and neural network activations.
- **Backend (Python FastAPI):** Asynchronous, high-throughput REST API with automatic OpenAPI Swagger documentation.
- **Database (SQLite + SQLAlchemy ORM):** Lightweight, zero-configuration relational storage for sensor readings, AI predictions, alerts, and device logs.
- **Machine Learning (Scikit-Learn & Keras):** StandardScaler feature scaling, categorical encoding, early stopping, and metric evaluation.

---

## 7. Deep Neural Network (DNN) Architecture

```
Input Layer (5 Features: Voltage, Current, Temperature, Light, Power)
         ↓
Dense Layer 1 (64 Neurons, ReLU Activation)
         ↓
Dropout Layer (Rate = 0.20 to prevent overfitting)
         ↓
Dense Layer 2 (32 Neurons, ReLU Activation)
         ↓
Dropout Layer (Rate = 0.20)
         ↓
Dense Layer 3 (16 Neurons, ReLU Activation)
         ↓
Output Layer (6 Neurons, Softmax Activation)
         ↓
Probabilities across 6 Classes (Sum = 1.0)
```

### Why this architecture?
- **Dense(64) & Dense(32):** Sufficient capacity to model non-linear interactions between irradiance and temperature derating without memorization.
- **Dropout (0.2):** Randomly deactivates 20% of neurons during training, forcing the network to learn robust generalized feature representations.
- **Softmax Activation:**
  $$\sigma(z)_i = \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}$$
  Converts raw logits into a normalized probability distribution where the highest probability indicates the predicted fault condition.

---

## 8. Anomaly Indicator
The prediction code calculates a heuristic score from the norm of the standardized input feature vector and compares it with a configured threshold. This can demonstrate an additional status indicator in the interface, but it is not a reconstruction error and is not produced by a trained Autoencoder. It should not be presented as validated out-of-distribution detection. Training and testing a real Autoencoder on collected normal-operation data would be a possible future enhancement.

---

## 9. Mathematical Formulations

### 1. Power Calculation
$$P = V \times I$$
*(Calculated automatically on the backend to avoid client tampering)*

### 2. Efficiency / Performance Ratio
$$\text{Expected Power } P_{\text{exp}} = \left(\frac{\text{Light (lx)}}{1000}\right) \times P_{\text{rated}}$$
$$\text{Efficiency \%} = \left(\frac{P_{\text{actual}}}{P_{\text{exp}}}\right) \times 100$$

### 3. Temperature Derating of Silicon Solar Cells
$$V_{\text{actual}} \approx V_{\text{MPP}} - \gamma \cdot (T - 25^\circ\text{C})$$
*where $\gamma \approx 0.04\text{ V}/^\circ\text{C}$ is the negative temperature coefficient.*

---

## 10. Frequently Asked Viva Questions & Answers

### Q1: Why did you choose a Deep Neural Network instead of standard Decision Trees or SVM?
**Answer:** While Decision Trees can classify simple boundaries, solar PV parameters exhibit complex, non-linear multi-variate correlations (e.g., how irradiance interacts with cell temperature to alter current and voltage simultaneously). A multi-layer DNN learns abstract continuous representations and outputs calibrated Softmax probabilities, giving not just a classification but a confidence score.

### Q2: Does the project include a trained Autoencoder for unknown-fault detection?
**Answer:** No. The current inference code reports a heuristic score calculated from the standardized input values; it does not run a trained Autoencoder or calculate reconstruction error. A real Autoencoder would need to be trained and evaluated before it could be described as an unknown-fault detector.

### Q3: Why is power ($P = V \times I$) calculated on the backend instead of on the ESP32 or frontend?
**Answer:** Calculating derived features on the backend ensures data integrity, centralizes business logic, and guarantees consistent preprocessing for both physical ESP32 telemetry and simulated data.

### Q4: How does the system differentiate between Dust and Partial Shading?
**Answer:**
- In **Partial Shading**, the ambient light sensor may read lower or non-uniform values, and bypass diodes activate, causing a severe, abrupt drop in current ($0.4 - 1.1\text{A}$).
- In **Dust/Soiling**, the ambient light sensor measures normal high sunlight ($750 - 950\text{ lx}$), but the glass transmittance is uniformly attenuated, causing a moderate, uniform current reduction ($1.1 - 1.55\text{A}$) with normal voltage.

### Q5: How do you detect an Electrical Fault?
**Answer:** An electrical fault (such as a loose connection, broken wiring, or damaged diode) causes a severe mismatch between voltage and current that defies normal solar $I-V$ curves—such as voltage collapsing to $6 - 12\text{V}$ while ambient light remains high.

### Q6: What happens if the ESP32 hardware loses Wi-Fi connection?
**Answer:** The FastAPI backend maintains a keep-alive `last_seen` timestamp. If no telemetry arrives within the heartbeat window, the frontend displays `ESP32 DISCONNECTED`. The built-in Simulation Mode can be enabled with one click to demonstrate full functionality.

---

## 11. Conclusion
Smart SolarGuard bridges the gap between hardware IoT telemetry and deep learning diagnostics. It proves that low-cost edge microcontrollers ($<\$5$) combined with lightweight deep neural networks can provide industrial-grade solar plant reliability, minimize downtime, and maximize clean energy yield.
