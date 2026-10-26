"""
==============================================================================
SMART SOLARGUARD: FastAPI Backend Application
IoT-Based Solar Panel Fault Detection using Deep Neural Network (DNN)
==============================================================================
"""

import sys
import os

# Guarantee venv site-packages in sys.path
_cur_dir = os.path.dirname(os.path.abspath(__file__))
_venv_site = os.path.join(_cur_dir, "venv", "Lib", "site-packages")
if os.path.exists(_venv_site) and _venv_site not in sys.path:
    sys.path.insert(0, _venv_site)
_parent_dir = os.path.dirname(_cur_dir)
if _parent_dir not in sys.path:
    sys.path.insert(0, _parent_dir)

import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from .database.connection import init_db
from .api.router import api_router
from .services.simulation_service import simulation_engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup:
    print("\n==================================================")
    print("   SMART SOLARGUARD BACKEND STARTUP INITIALIZING   ")
    print("==================================================")
    init_db()
    print("[OK] SQLite Database initialized.")
    simulation_engine.start_background_task()
    print("[OK] Background simulation engine started.")
    yield
    # Shutdown:
    print("[INFO] Smart SolarGuard Backend shutting down.")

app = FastAPI(
    title="Smart SolarGuard API",
    description="IoT-Based Solar Panel Fault Detection using Deep Neural Network (DNN) & Autoencoder Baseline",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Vite frontend and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router)

@app.get("/", include_in_schema=False)
def root():
    return {
        "title": "Smart SolarGuard: IoT Solar Panel Fault Detection API",
        "documentation": "/docs",
        "health": "/api/health",
        "latest_telemetry": "/api/sensors/latest",
        "simulation_status": "/api/simulation/status"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
