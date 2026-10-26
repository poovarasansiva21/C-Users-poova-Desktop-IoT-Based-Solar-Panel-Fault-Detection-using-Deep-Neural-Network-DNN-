"""
SMART SOLARGUARD: Feature Extraction and Preprocessing Module
Manages StandardScaler serialization and feature extraction
"""

import os
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = ["voltage", "current", "temperature", "light_intensity", "power"]

CLASS_NAMES = [
    "NORMAL",
    "SHADING",
    "DUST",
    "ELECTRICAL_FAULT",
    "LOW_POWER",
    "OVERHEATING"
]

CLASS_TO_INDEX = {name: idx for idx, name in enumerate(CLASS_NAMES)}
INDEX_TO_CLASS = {idx: name for idx, name in enumerate(CLASS_NAMES)}

FAULT_METADATA = {
    "NORMAL": {
        "severity": "LOW",
        "title": "Normal Operation",
        "description": "Solar panel is operating within optimal electrical and environmental parameters.",
        "recommendation": "System running optimally. Routine scheduled maintenance only."
    },
    "SHADING": {
        "severity": "MEDIUM",
        "title": "Partial Shading Detected",
        "description": "Localized illumination drop detected. Sub-strings are bottlenecked by shadow cast by foliage, overhead structures, or buildings.",
        "recommendation": "Inspect solar array surroundings. Clear foliage or check for physical shadow obstructions."
    },
    "DUST": {
        "severity": "MEDIUM",
        "title": "Soiling & Dust Accumulation",
        "description": "Ambient sunlight is sufficient, but surface transmittance is reduced by a uniform layer of dirt/dust, suppressing current output.",
        "recommendation": "Inspect and clean solar panel glass surface with soft demineralized water wash."
    },
    "ELECTRICAL_FAULT": {
        "severity": "CRITICAL",
        "title": "Electrical Component Failure",
        "description": "Abnormal voltage/current divergence detected. Indicates loose terminal, microcrack, shorted bypass diode, or wiring discontinuity.",
        "recommendation": "URGENT: Disconnect load, inspect MC4 connectors, check junction box diodes, and measure open-circuit voltage (Voc)."
    },
    "LOW_POWER": {
        "severity": "HIGH",
        "title": "Sub-optimal Power Yield",
        "description": "Power output is significantly below nominal rating despite adequate solar irradiance. Possible cell degradation or impedance mismatch.",
        "recommendation": "Verify inverter MPPT tracking, measure string resistance, and check for module degradation."
    },
    "OVERHEATING": {
        "severity": "HIGH",
        "title": "Thermal Overheating / Hotspot",
        "description": "Operating temperature exceeds critical thermal thresholds (>52°C), leading to steep voltage drop from silicon bandgap reduction.",
        "recommendation": "Inspect panel rear ventilation, check for thermal hotspot with IR thermography, and ensure adequate convective airflow."
    }
}

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")

def is_scaler_ready() -> bool:
    return os.path.exists(SCALER_PATH)

def load_scaler():
    if os.path.exists(SCALER_PATH):
        try:
            return joblib.load(SCALER_PATH)
        except Exception as e:
            print(f"[ERROR] Failed to load scaler from {SCALER_PATH}: {e}")
    return None

def save_scaler(scaler, path: str = None):
    if path is None:
        path = SCALER_PATH
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(scaler, path)
    print(f"[OK] Scaler saved to {path}")

def extract_features(voltage: float, current: float, temperature: float, light_intensity: float, power: float = None):
    if power is None or power <= 0:
        power = round(voltage * current, 2)
    return np.array([[voltage, current, temperature, light_intensity, power]], dtype=np.float32)
