import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DeviceItem, FaultType } from '../types';
import { DeviceStatus } from '../components/DeviceStatus';
import {
  Cpu,
  Wifi,
  Radio,
  Play,
  Pause,
  Sliders,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

interface IotDevicesProps {
  onRefreshTelemetry: () => void;
}

export const IotDevices: React.FC<IotDevicesProps> = ({ onRefreshTelemetry }) => {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [simStatus, setSimStatus] = useState<any>({ is_running: true, current_scenario: 'NORMAL' });
  const [loading, setLoading] = useState(false);
  const [scenarioSuccess, setScenarioSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const devList = await api.getDevices();
      setDevices(devList);
      const sim = await api.getSimulationStatus();
      setSimStatus(sim);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSimulation = async () => {
    try {
      if (simStatus.is_running) {
        await api.stopSimulation();
      } else {
        await api.startSimulation();
      }
      loadData();
      onRefreshTelemetry();
    } catch (e) {
      console.error(e);
    }
  };

  const handleScenarioSelect = async (scenario: FaultType) => {
    setLoading(true);
    setScenarioSuccess(null);
    try {
      const res = await api.generateScenario(scenario);
      setScenarioSuccess(`Generated ${scenario} telemetry: ${res.reading.voltage}V, ${res.reading.current}A`);
      loadData();
      onRefreshTelemetry();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const defaultDevice: DeviceItem = devices[0] || {
    id: 1,
    device_name: 'ESP32 Solar Monitor',
    device_id: 'ESP32-SOLAR-001',
    status: 'CONNECTED',
    ip_address: '192.168.1.105',
    last_seen: new Date().toISOString(),
    total_telemetry_sent: 1420,
    sensors: [
      { name: 'Voltage Divider', pin: 'GPIO34', status: 'ACTIVE' },
      { name: 'ACS712 Current', pin: 'GPIO35', status: 'ACTIVE' },
      { name: 'LM35 Temperature', pin: 'GPIO33', status: 'ACTIVE' },
      { name: 'LDR Light Sensor', pin: 'GPIO32', status: 'ACTIVE' }
    ],
    firmware_version: 'ESP32-SG-v1.2',
    simulation_active: simStatus.is_running
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <span>Hardware Management</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Edge Gateway & Node Controller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            IoT Device Management & Simulator
          </h1>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          title="Refresh Device State"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Device Card */}
      <DeviceStatus device={defaultDevice} onRefresh={loadData} />

      {/* Comprehensive Hardware Simulation Center */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Telemetry Simulation Control Suite
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Virtual Physical Twin
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Allows testing, verification, and college demonstration without physical solar equipment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSimulation}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                simStatus.is_running
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {simStatus.is_running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{simStatus.is_running ? 'Simulation: RUNNING' : 'Simulation: PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Scenario Injection Buttons */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Inject Fault Scenario Telemetry:
            </span>
            <span className="text-xs font-mono text-amber-400">
              Active Mode: <strong>{simStatus.current_scenario}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'NORMAL',
                title: 'Normal Operation',
                desc: '18–20V, 1.8–2.3A, 25–35°C, 700–1000 lx',
                badge: 'Rated MPP',
                color: 'hover:border-emerald-500'
              },
              {
                id: 'SHADING',
                title: 'Partial Shading Fault',
                desc: 'Reduced light (350-550 lx), reduced current (0.4-1.1A)',
                badge: 'Current Bottleneck',
                color: 'hover:border-amber-500'
              },
              {
                id: 'DUST',
                title: 'Dust / Soiled Surface',
                desc: 'High ambient light, transmittance suppressed, 1.1-1.5A',
                badge: 'Transmittance Loss',
                color: 'hover:border-purple-500'
              },
              {
                id: 'ELECTRICAL_FAULT',
                title: 'Electrical Fault',
                desc: 'Abnormal V/I divergence (6-13V), erratic resistance',
                badge: 'Open / Diode Short',
                color: 'hover:border-rose-500'
              },
              {
                id: 'LOW_POWER',
                title: 'Low Power Yield',
                desc: 'Sub-optimal power output (13-15V, 0.9-1.3A)',
                badge: 'Impedance Mismatch',
                color: 'hover:border-orange-500'
              },
              {
                id: 'OVERHEATING',
                title: 'Thermal Overheating',
                desc: 'Excessive cell temperature (>60°C), voltage drops sharply',
                badge: 'Bandgap Derating',
                color: 'hover:border-red-500'
              }
            ].map((sc) => (
              <button
                key={sc.id}
                disabled={loading}
                onClick={() => handleScenarioSelect(sc.id as FaultType)}
                className={`p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left transition-all hover:scale-[1.02] disabled:opacity-50 group ${sc.color}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs text-white">{sc.id}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {sc.badge}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-400 transition">
                  {sc.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{sc.desc}</p>
              </button>
            ))}
          </div>

          {scenarioSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{scenarioSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
