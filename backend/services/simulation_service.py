"""
SMART SOLARGUARD: Simulation Engine
Provides continuous background simulation and on-demand scenario generation
"""

import asyncio
import random
import datetime
from sqlalchemy.orm import Session
from ..database.models import SensorReading, Prediction, Alert, Device
from ..database.connection import SessionLocal
from ..ai.predict import predict_fault

class SimulationEngine:
    def __init__(self):
        self.is_running = True  # Enabled by default for seamless college demonstration
        self.current_scenario = "NORMAL"
        self.interval = 3.0  # seconds
        self._task = None

    def set_scenario(self, scenario: str):
        valid = ["NORMAL", "SHADING", "DUST", "ELECTRICAL_FAULT", "LOW_POWER", "OVERHEATING"]
        scenario = scenario.upper().replace(" ", "_").replace("-", "_")
        if scenario in valid:
            self.current_scenario = scenario
            print(f"[SIMULATION] Scenario switched to: {self.current_scenario}")
            return True
        return False

    def generate_reading_values(self, scenario: str = None):
        if scenario is None:
            scenario = self.current_scenario

        if scenario == "NORMAL":
            light = round(random.uniform(780.0, 960.0), 1)
            temp = round(random.uniform(28.0, 36.0), 1)
            voltage = round(random.uniform(18.2, 19.8) - max(0, temp - 25) * 0.03, 2)
            current = round((light / 1000.0) * random.uniform(2.1, 2.35), 2)

        elif scenario == "SHADING":
            light = round(random.uniform(350.0, 560.0), 1)
            temp = round(random.uniform(24.0, 31.0), 1)
            voltage = round(random.uniform(14.5, 17.0), 2)
            current = round(random.uniform(0.45, 1.15), 2)

        elif scenario == "DUST":
            light = round(random.uniform(780.0, 940.0), 1)
            temp = round(random.uniform(32.0, 42.0), 1)
            voltage = round(random.uniform(16.8, 18.4), 2)
            current = round(random.uniform(1.20, 1.55), 2)

        elif scenario == "ELECTRICAL_FAULT":
            light = round(random.uniform(750.0, 920.0), 1)
            temp = round(random.uniform(30.0, 48.0), 1)
            voltage = round(random.uniform(6.5, 12.8), 2)
            current = round(random.uniform(0.35, 1.40), 2)

        elif scenario == "LOW_POWER":
            light = round(random.uniform(680.0, 840.0), 1)
            temp = round(random.uniform(27.0, 35.0), 1)
            voltage = round(random.uniform(13.2, 15.6), 2)
            current = round(random.uniform(0.95, 1.30), 2)

        elif scenario == "OVERHEATING":
            light = round(random.uniform(840.0, 980.0), 1)
            temp = round(random.uniform(62.0, 82.0), 1)
            voltage = round(random.uniform(13.5, 15.8), 2)
            current = round(random.uniform(1.85, 2.25), 2)

        else:
            # Fallback
            light = 850.0
            temp = 32.0
            voltage = 18.5
            current = 2.1

        power = round(voltage * current, 2)
        return {
            "voltage": voltage,
            "current": current,
            "temperature": temp,
            "light_intensity": light,
            "power": power,
            "device_id": "ESP32-SOLAR-001"
        }

    def process_and_store(self, data: dict, db: Session):
        # 1. Store sensor reading
        reading = SensorReading(
            timestamp=datetime.datetime.utcnow(),
            voltage=data["voltage"],
            current=data["current"],
            temperature=data["temperature"],
            light_intensity=data["light_intensity"],
            power=data["power"],
            device_id=data.get("device_id", "ESP32-SOLAR-001")
        )
        db.add(reading)
        db.flush()

        # 2. Run automated AI prediction
        ai_res = predict_fault(
            voltage=data["voltage"],
            current=data["current"],
            temperature=data["temperature"],
            light_intensity=data["light_intensity"],
            power=data["power"]
        )

        import json
        prediction = Prediction(
            sensor_reading_id=reading.id,
            prediction=ai_res["prediction"],
            confidence=ai_res["confidence"],
            severity=ai_res["severity"],
            recommendation=ai_res["recommendation"],
            probabilities_json=json.dumps(ai_res["probabilities"]),
            timestamp=datetime.datetime.utcnow()
        )
        db.add(prediction)
        db.flush()

        # 3. Alert Duplication Control
        alert_obj = None
        now_dt = datetime.datetime.utcnow()
        if ai_res["prediction"] != "NORMAL":
            active_alert = db.query(Alert).filter(
                Alert.fault_type == ai_res["prediction"],
                Alert.status == "ACTIVE"
            ).first()

            if active_alert:
                active_alert.timestamp = now_dt
                alert_obj = active_alert
            else:
                # Resolve previous active alerts of different fault types
                db.query(Alert).filter(Alert.status == "ACTIVE").update({"status": "RESOLVED"})
                alert_obj = Alert(
                    prediction_id=prediction.id,
                    fault_type=ai_res["prediction"],
                    severity=ai_res["severity"],
                    message=f"{ai_res['title']} detected on {reading.device_id} (Confidence: {int(ai_res['confidence'] * 100)}%)",
                    recommendation=ai_res["recommendation"],
                    status="ACTIVE",
                    timestamp=now_dt
                )
                db.add(alert_obj)
        else:
            # Returned to NORMAL: resolve active alerts
            db.query(Alert).filter(Alert.status == "ACTIVE").update({"status": "RESOLVED"})

        # 4. Update device last seen
        dev = db.query(Device).filter(Device.device_id == reading.device_id).first()
        if dev:
            dev.last_seen = datetime.datetime.utcnow()
            dev.status = "CONNECTED"

        db.commit()
        db.refresh(reading)
        db.refresh(prediction)

        return {
            "reading": reading,
            "prediction": prediction,
            "alert": alert_obj,
            "ai_result": ai_res
        }

    async def _loop(self):
        while True:
            try:
                if self.is_running:
                    db = SessionLocal()
                    try:
                        data = self.generate_reading_values()
                        self.process_and_store(data, db)
                    finally:
                        db.close()
            except Exception as e:
                print(f"[SIMULATION ERROR] {e}")
            await asyncio.sleep(self.interval)

    def start(self):
        if not self.is_running:
            self.is_running = True
            print("[SIMULATION] Engine started.")

    def stop(self):
        self.is_running = False
        print("[SIMULATION] Engine stopped.")

    def start_background_task(self):
        if self._task is None:
            self._task = asyncio.create_task(self._loop())
            print("[SIMULATION] Background continuous telemetry generator active.")

simulation_engine = SimulationEngine()
