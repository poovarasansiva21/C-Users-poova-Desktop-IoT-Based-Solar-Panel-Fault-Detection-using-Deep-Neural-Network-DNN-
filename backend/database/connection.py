import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, Device

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "smart_solarguard.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    # Ensure default device exists
    db = SessionLocal()
    try:
        dev = db.query(Device).filter(Device.device_id == "ESP32-SOLAR-001").first()
        if not dev:
            default_device = Device(
                device_name="ESP32 Solar Monitor",
                device_id="ESP32-SOLAR-001",
                status="CONNECTED",
                ip_address="192.168.1.105"
            )
            db.add(default_device)
            db.commit()
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
