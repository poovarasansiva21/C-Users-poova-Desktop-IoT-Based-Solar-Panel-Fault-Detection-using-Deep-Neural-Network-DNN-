import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    voltage = Column(Float, nullable=False)
    current = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    light_intensity = Column(Float, nullable=False)
    power = Column(Float, nullable=False)
    device_id = Column(String(50), default="ESP32-SOLAR-001", index=True)

    prediction = relationship("Prediction", back_populates="reading", uselist=False, cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sensor_reading_id = Column(Integer, ForeignKey("sensor_readings.id"), nullable=True, index=True)
    prediction = Column(String(50), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    severity = Column(String(20), default="LOW")
    recommendation = Column(Text, nullable=True)
    probabilities_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    reading = relationship("SensorReading", back_populates="prediction")
    alert = relationship("Alert", back_populates="prediction", uselist=False)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=True, index=True)
    fault_type = Column(String(50), nullable=False, index=True)
    severity = Column(String(20), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    message = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=True)
    status = Column(String(20), default="ACTIVE", index=True)  # ACTIVE, ACKNOWLEDGED, RESOLVED
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    prediction = relationship("Prediction", back_populates="alert")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_name = Column(String(100), default="ESP32 Solar Monitor")
    device_id = Column(String(50), unique=True, index=True, nullable=False)
    status = Column(String(20), default="CONNECTED")  # CONNECTED, SIMULATED, DISCONNECTED
    ip_address = Column(String(50), default="192.168.1.105")
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
