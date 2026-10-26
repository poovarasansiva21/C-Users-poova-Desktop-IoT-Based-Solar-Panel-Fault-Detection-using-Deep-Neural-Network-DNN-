import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Radio,
  Clock,
  Bell,
  Shield,
  Server,
  Database,
  CheckCircle,
  Cpu
} from 'lucide-react';

interface SettingsProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  refreshInterval: number;
  onIntervalChange: (interval: number) => void;
  isOnline: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  onToggleTheme,
  isSimulating,
  onToggleSimulation,
  refreshInterval,
  onIntervalChange,
  isOnline
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 text-xs font-mono text-slate-400">
          <span>Preferences & Telemetry Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Settings & Platform Parameters
        </h1>
      </div>

      {savedBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Settings successfully persisted to local storage cache.</span>
        </div>
      )}

      {/* Group 1: Appearance & UI */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-white">Color Mode</h4>
            <p className="text-xs text-slate-400">Toggle between Dark Solar theme and Clean Light theme</p>
          </div>
          <button
            onClick={onToggleTheme}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{theme === 'dark' ? 'Dark Solar Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Telemetry Polling Rate */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              Telemetry Polling Frequency
            </h4>
            <p className="text-xs text-slate-400">Adjust how frequently the dashboard requests live data from the backend</p>
          </div>
          <div className="flex items-center gap-2">
            {[2000, 3000, 5000].map((rate) => (
              <button
                key={rate}
                onClick={() => onIntervalChange(rate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  refreshInterval === rate
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {rate / 1000}s
              </button>
            ))}
          </div>
        </div>

        {/* Hardware Simulation Mode */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-400" />
              Continuous Simulation Engine
            </h4>
            <p className="text-xs text-slate-400">
              When enabled, the backend generates continuous solar telemetry automatically
            </p>
          </div>
          <button
            onClick={onToggleSimulation}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isSimulating ? 'SIMULATION ACTIVE' : 'SIMULATION OFF'}
          </button>
        </div>
      </div>

      {/* Group 2: Alert Rules & Sound */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-400" />
          Alert Thresholds & Notifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Critical Voltage Collapse Threshold</span>
            <span className="text-white font-mono font-bold text-sm">V &lt; 13.5 V</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Thermal Hotspot Warning Level</span>
            <span className="text-white font-mono font-bold text-sm">Temp &gt; 52.0 °C</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Autoencoder Anomaly Epsilon</span>
            <span className="text-white font-mono font-bold text-sm">MSE &gt; 0.100</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Performance Ratio Cutoff</span>
            <span className="text-white font-mono font-bold text-sm">Efficiency &lt; 65%</span>
          </div>
        </div>
      </div>

      {/* Group 3: Platform Diagnostics */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          Diagnostic Status & Host Info
        </h3>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Backend API URL:</span>
            <span className="text-white">http://127.0.0.1:8000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">API Connection:</span>
            <span className={isOnline ? 'text-emerald-400' : 'text-rose-400'}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Database Engine:</span>
            <span className="text-white">SQLite3 (smart_solarguard.db)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Deep Learning Model:</span>
            <span className="text-white">SolarGuard DNN v1.0 (Dense 64-32-16-6)</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
