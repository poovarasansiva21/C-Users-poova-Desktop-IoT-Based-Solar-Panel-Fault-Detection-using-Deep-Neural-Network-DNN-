import {
  SensorReading,
  PredictionResult,
  AlertItem,
  FaultHistoryItem,
  DeviceItem,
  ModelMetrics,
  FaultType
} from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  async getLatestSensor(): Promise<SensorReading> {
    const res = await fetch(`${API_BASE}/sensors/latest`);
    if (!res.ok) throw new Error('Failed to fetch latest sensor reading');
    return res.json();
  },

  async getSensorHistory(range: string = '30m', limit: number = 100, fault?: string) {
    const params = new URLSearchParams({ range, limit: limit.toString() });
    if (fault && fault !== 'ALL') params.append('fault', fault);
    const res = await fetch(`${API_BASE}/sensors/history?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch sensor history');
    return res.json();
  },

  async postSensorReading(data: { voltage: number; current: number; temperature: number; light_intensity: number; power?: number }) {
    const res = await fetch(`${API_BASE}/sensors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to post sensor reading');
    return res.json();
  },

  async runPrediction(data: { voltage: number; current: number; temperature: number; light_intensity: number; power?: number }): Promise<PredictionResult> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('AI Prediction API unavailable');
    return res.json();
  },

  async getAlerts(status: string = 'ALL'): Promise<AlertItem[]> {
    const res = await fetch(`${API_BASE}/alerts?status=${status}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async updateAlertStatus(alertId: number, status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED') {
    const res = await fetch(`${API_BASE}/alerts/${alertId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return res.json();
  },

  async getFaults(faultType: string = 'ALL'): Promise<FaultHistoryItem[]> {
    const res = await fetch(`${API_BASE}/faults?fault_type=${faultType}`);
    if (!res.ok) throw new Error('Failed to fetch fault history');
    return res.json();
  },

  async getModelInfo() {
    const res = await fetch(`${API_BASE}/model/info`);
    if (!res.ok) throw new Error('Failed to fetch model info');
    return res.json();
  },

  async getModelMetrics(): Promise<ModelMetrics> {
    const res = await fetch(`${API_BASE}/model/metrics`);
    if (!res.ok) throw new Error('Failed to fetch model metrics');
    return res.json();
  },

  async getDevices(): Promise<DeviceItem[]> {
    const res = await fetch(`${API_BASE}/devices`);
    if (!res.ok) throw new Error('Failed to fetch IoT devices');
    return res.json();
  },

  async testDeviceConnection() {
    const res = await fetch(`${API_BASE}/devices/test`, { method: 'POST' });
    if (!res.ok) throw new Error('Device diagnostic test failed');
    return res.json();
  },

  async startSimulation() {
    const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start simulation');
    return res.json();
  },

  async stopSimulation() {
    const res = await fetch(`${API_BASE}/simulation/stop`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to stop simulation');
    return res.json();
  },

  async generateScenario(scenario: FaultType) {
    const res = await fetch(`${API_BASE}/simulation/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
    if (!res.ok) throw new Error(`Failed to generate scenario: ${scenario}`);
    return res.json();
  },

  async getSimulationStatus() {
    const res = await fetch(`${API_BASE}/simulation/status`);
    if (!res.ok) throw new Error('Failed to fetch simulation status');
    return res.json();
  }
};
