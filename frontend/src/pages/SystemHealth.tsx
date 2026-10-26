import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Server,
  Database,
  Cpu,
  Brain,
  ShieldCheck,
  ShieldAlert,
  Activity,
  RefreshCw,
  Clock,
  Radio
} from 'lucide-react';

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const data = await api.getHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealth(data);
    } catch (e) {
      setHealth(null);
      setLatency(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, 5000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = health?.backend_status === 'ONLINE';
  const dbOnline = health?.database_status === 'ONLINE';
  const esp32Connected = health?.esp32_status === 'CONNECTED';
  const modelReady = health?.ai_model_status === 'READY';

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <span>Runtime Diagnostics</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">System Health & Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live System Health & Infrastructure
          </h1>
        </div>

        <button
          onClick={checkHealth}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Ping Services</span>
        </button>
      </div>

      {/* 4 Primary Component Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Backend */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">FastAPI Backend</span>
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className={`text-xl font-bold font-mono ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-2 block">
            Latency: {latency !== null ? `${latency} ms` : 'Timeout'}
          </span>
        </div>

        {/* Database */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">SQLite Database</span>
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dbOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span className={`text-xl font-bold font-mono ${dbOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              {dbOnline ? 'ONLINE' : 'ERROR'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-2 block">
            Rows Logged: {health?.total_readings || 0}
          </span>
        </div>

        {/* ESP32 Hardware */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">ESP32 Hardware</span>
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${esp32Connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className={`text-xl font-bold font-mono ${esp32Connected ? 'text-emerald-400' : 'text-rose-400'}`}>
              {esp32Connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-2 block">
            {health?.last_seen_seconds_ago !== null
              ? `Last Packet: ${health.last_seen_seconds_ago}s ago`
              : 'No heartbeat received'}
          </span>
        </div>

        {/* AI Model */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">AI / DNN Model</span>
            <div className="p-2 rounded-xl bg-slate-800 text-purple-400">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${modelReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className={`text-xl font-bold font-mono ${modelReady ? 'text-emerald-400' : 'text-amber-400'}`}>
              {modelReady ? 'READY' : 'NOT READY'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-2 block">
            {modelReady ? 'solar_fault_dnn.joblib' : 'Model not trained'}
          </span>
        </div>
      </div>

      {/* Deep Inspection Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          Detailed End-to-End Pipeline Telemetry
        </h3>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Active Incidents / Alerts:</span>
            <span className="text-white font-bold">{health?.active_alerts_count || 0} active</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Last Telemetry Timestamp:</span>
            <span className="text-white">{health?.last_reading_time || 'None'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Simulation Engine State:</span>
            <span className="text-amber-400">
              {health?.simulation?.is_running ? `RUNNING (${health.simulation.scenario})` : 'STOPPED'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Model Artifacts Verified:</span>
            <span className={modelReady ? 'text-emerald-400' : 'text-rose-400'}>
              {modelReady ? 'solar_fault_dnn.joblib & scaler.pkl present' : 'Missing files'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Server Time:</span>
            <span className="text-slate-300">{health?.server_time || new Date().toISOString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
