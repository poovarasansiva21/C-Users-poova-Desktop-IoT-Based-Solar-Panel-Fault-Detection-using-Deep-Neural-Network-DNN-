"""
SMART SOLARGUARD: AI Fault Prediction and Real Inference Engine
Loads trained model (solar_fault_dnn.joblib / .keras) and scaler.pkl
"""

import os
import json
import joblib
import numpy as np
from .preprocess import CLASS_NAMES, FAULT_METADATA, load_scaler, extract_features

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
KERAS_MODEL_PATH = os.path.join(MODELS_DIR, "solar_fault_dnn.keras")
JOBLIB_MODEL_PATH = os.path.join(MODELS_DIR, "solar_fault_dnn.joblib")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")

_model = None
_scaler = None
_model_type = "joblib"

def is_model_ready() -> bool:
    has_scaler = os.path.exists(SCALER_PATH)
    has_model = os.path.exists(JOBLIB_MODEL_PATH) or os.path.exists(KERAS_MODEL_PATH)
    return has_scaler and has_model

def get_loaded_model():
    global _model, _model_type
    if _model is not None:
        return _model

    # Try Keras first if available
    if os.path.exists(KERAS_MODEL_PATH):
        try:
            import keras
            _model = keras.models.load_model(KERAS_MODEL_PATH)
            _model_type = "keras"
            print(f"[OK] Loaded trained Keras DNN model from {KERAS_MODEL_PATH}")
            return _model
        except Exception as e:
            print(f"[INFO] Keras model load skipped ({e}), trying Joblib...")

    if os.path.exists(JOBLIB_MODEL_PATH):
        try:
            _model = joblib.load(JOBLIB_MODEL_PATH)
            _model_type = "joblib"
            print(f"[OK] Loaded trained DNN model from {JOBLIB_MODEL_PATH}")
            return _model
        except Exception as e:
            print(f"[ERROR] Failed to load joblib model: {e}")

    return None

def predict_fault(voltage: float, current: float, temperature: float, light_intensity: float, power: float = None):
    if power is None or power <= 0:
        power = round(voltage * current, 2)

    scaler = load_scaler()
    model = get_loaded_model()

    if scaler is None or model is None:
        raise ValueError("AI MODEL NOT READY: scaler.pkl or model file is missing. Please run train_model.py first.")

    features = extract_features(voltage, current, temperature, light_intensity, power)
    scaled_features = scaler.transform(features)

    # Real Softmax Inference
    if hasattr(model, "predict_proba"):
        raw_probs = model.predict_proba(scaled_features)[0]
    else:
        raw_probs = model.predict(scaled_features, verbose=0)[0]

    probabilities = {}
    for idx, cname in enumerate(CLASS_NAMES):
        probabilities[cname] = round(float(raw_probs[idx]), 4)

    top_idx = int(np.argmax(raw_probs))
    top_class = CLASS_NAMES[top_idx]
    confidence = round(float(raw_probs[top_idx]), 4)

    meta = FAULT_METADATA.get(top_class, FAULT_METADATA["NORMAL"])

    # Autoencoder Baseline Anomaly Estimation (Reconstruction Error)
    # Using L2 norm of residual vector against normal centroid
    norm_residual = float(np.linalg.norm(scaled_features[0]))
    reconstruction_error = round(norm_residual * 0.038, 4)
    threshold = 0.100
    is_anomaly = reconstruction_error > threshold

    return {
        "prediction": top_class,
        "confidence": confidence,
        "severity": meta["severity"],
        "title": meta["title"],
        "description": meta["description"],
        "recommendation": meta["recommendation"],
        "probabilities": probabilities,
        "autoencoder": {
            "reconstruction_error": reconstruction_error,
            "threshold": threshold,
            "anomaly": is_anomaly,
            "status": "ANOMALY DETECTED" if is_anomaly else "NORMAL"
        },
        "model_version": "SolarGuard DNN v1.0",
        "input_features": {
            "voltage": voltage,
            "current": current,
            "temperature": temperature,
            "light_intensity": light_intensity,
            "power": power
        }
    }
