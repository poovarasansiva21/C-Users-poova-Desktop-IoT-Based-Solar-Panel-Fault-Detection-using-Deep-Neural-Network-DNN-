import React from 'react';
import { Radio, Server, Database, Brain, Moon, Sun, Play, Pause, Menu } from 'lucide-react';

interface SystemHealthData {
  backend_status?: string;
  database_status?: string;
  esp32_status?: string;
  ai_model_status?: string;
}

interface TopbarProps {
  isOnline: boolean;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  lastUpdated: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
  systemHealth?: SystemHealthData | null;
}

export const Topbar: React.FC<TopbarProps> = ({
  isOnline,
  isSimulating,
  onToggleSimulation,
  lastUpdated,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
  systemHealth
}) => {
  const esp32Connected = systemHealth?.esp32_status === 'CONNECTED';
  const dbOnline = systemHealth?.database_status === 'ONLINE';
  const modelReady = systemHealth?.ai_model_status === 'READY';
  const backendOnline = isOnline && (systemHealth?.backend_status === 'ONLINE' || !systemHealth);

  return (
    <header className="h-16 px-4 lg:px-8 border-b border-slate-800/80 bg-[#0c1220]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Real-Time Connectivity Indicators (4 Live System Badges) */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 text-xs">
          {/* 1. ESP32 Hardware Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border text-[11px] sm:text-xs transition-colors ${
              esp32Connected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
            title={`ESP32 Hardware: ${esp32Connected ? 'Connected (Heartbeat active)' : 'Disconnected (Timeout > 15s)'}`}
          >
            <Radio className={`w-3.5 h-3.5 ${esp32Connected ? 'animate-pulse' : ''}`} />
            <span className="hidden md:inline">ESP32:</span>
            <span>{esp32Connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>

          {/* 2. Backend Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border text-[11px] sm:text-xs transition-colors ${
              backendOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
            title={`FastAPI Backend: ${backendOnline ? 'Online' : 'Offline'}`}
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden md:inline">API:</span>
            <span>{backendOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          {/* 3. Database Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border text-[11px] sm:text-xs transition-colors ${
              dbOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
            title={`SQLite Database: ${dbOnline ? 'Online' : 'Error'}`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">DB:</span>
            <span>{dbOnline ? 'ONLINE' : 'ERROR'}</span>
          </div>

          {/* 4. AI Model Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border text-[11px] sm:text-xs transition-colors ${
              modelReady
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
            title={`DNN Model: ${modelReady ? 'Ready & Loaded' : 'Not Loaded'}`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="hidden md:inline">DNN:</span>
            <span>{modelReady ? 'READY' : 'NOT READY'}</span>
          </div>

          {/* Simulation Active Indicator Pill */}
          {isSimulating && (
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              SIMULATOR ACTIVE
            </div>
          )}

          {/* Last Updated Timestamp */}
          <span className="text-[11px] font-mono text-slate-400 hidden 2xl:inline ml-1">
            {lastUpdated}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Simulation Toggle */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isSimulating
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Toggle Simulation Fallback Stream"
        >
          {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">
            {isSimulating ? 'Pause Sim' : 'Start Sim'}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 transition"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
};

