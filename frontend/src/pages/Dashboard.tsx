import React, { useState, useEffect } from 'react';
import { SensorReading, AlertItem, FaultType } from '../types';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { FaultBadge } from '../components/FaultBadge';
import { EfficiencyCard } from '../components/EfficiencyCard';
import {
  Zap,
  Activity,
  Thermometer,
  Sun,
  ShieldAlert,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Radio,
  Sliders
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DashboardProps {
  onNavigate: (route: string) => void;
  latestSensor: SensorReading | null;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  latestSensor,
  isSimulating,
  onToggleSimulation,
  onRefresh
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>([]);
  const [scenarioLoading, setScenarioLoading] = useState(false);

  // Fetch recent history for live mini charts
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await api.getSensorHistory('5m', 25);
        if (res.chronological) {
          setChartData(res.chronological);
        }
      } catch (e) {
        console.error('Error fetching dashboard chart data:', e);
      }
    };
    loadHistory();
    const interval = setInterval(loadHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch active alerts
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await api.getAlerts('ACTIVE');
        setActiveAlerts(data.slice(0, 2));
      } catch (e) {
        console.error('Error fetching alerts:', e);
      }
    };
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerScenario = async (scenario: FaultType) => {
    setScenarioLoading(true);
    try {
      await api.generateScenario(scenario);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setScenarioLoading(false);
    }
  };

  const voltage = latestSensor?.voltage || 18.5;
  const current = latestSensor?.current || 2.1;
  const temp = latestSensor?.temperature || 32.4;
  const light = latestSensor?.light_intensity || 850;
  const power = latestSensor?.power || 38.85;
  const condition = latestSensor?.prediction?.condition || 'NORMAL';
  const confidence = latestSensor?.prediction?.confidence
    ? Math.round(latestSensor.prediction.confidence * 1000) / 10
    : 96.8;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Operational Telemetry
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-400">Real-Time Solar Panel Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart SolarGuard Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('ai-detection')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition hover:scale-105"
          >
            <Sparkles className="w-4 h-4" /> Run AI Analysis
          </button>
        </div>
      </div>

      {/* Active Fault Alert Banner (if abnormal condition) */}
      {condition !== 'NORMAL' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Abnormal Condition: {condition}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20">
                  {confidence}% Confidence
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {latestSensor?.prediction?.recommendation || 'Check array parameters and physical conditions.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-detection')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
          >
            Inspect AI Diagnosis →
          </button>
        </div>
      )}

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Panel Status */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Panel Status
            </span>
            <div className="p-2 rounded-lg bg-slate-800/80 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <FaultBadge fault={condition} className="text-xs py-1" />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            DNN Confidence: <strong className="text-white">{confidence}%</strong>
          </div>
        </div>

        {/* Voltage */}
        <StatCard
          title="Terminal Voltage"
          value={voltage}
          unit="V"
          decimals={2}
          icon={Zap}
          iconColor="text-amber-400"
          subtitle="Nominal: 18.0–20.5V"
        />

        {/* Current */}
        <StatCard
          title="Load Current"
          value={current}
          unit="A"
          decimals={2}
          icon={Activity}
          iconColor="text-cyan-400"
          subtitle="Rated MPP: 2.10A"
        />

        {/* Temperature */}
        <StatCard
          title="Surface Temp"
          value={temp}
          unit="°C"
          decimals={1}
          icon={Thermometer}
          iconColor="text-rose-400"
          subtitle="Threshold: <50°C"
        />

        {/* Light Intensity */}
        <StatCard
          title="Light Irradiance"
          value={light}
          unit="lx"
          decimals={0}
          icon={Sun}
          iconColor="text-yellow-400"
          subtitle="Ambient: 750–1000 lx"
        />

        {/* Power Output */}
        <StatCard
          title="Power Output"
          value={power}
          unit="W"
          decimals={2}
          icon={Zap}
          iconColor="text-emerald-400"
          highlight={true}
          subtitle="Calculated: V × I"
        />
      </div>

      {/* Live Charts + Efficiency Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Power & Voltage Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Live Power & Voltage Trajectory
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Streamed from backend telemetry cache</p>
            </div>
            <button
              onClick={() => onNavigate('live-sensors')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              All 5 Live Sensor Charts <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="voltGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  name="Power (W)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#powerGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="voltage"
                  name="Voltage (V)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#voltGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Dynamic Efficiency Card */}
        <div className="flex flex-col justify-between">
          <EfficiencyCard
            actualPower={power}
            expectedPower={latestSensor?.expected_power || 42.0}
            lightIntensity={light}
          />
        </div>
      </div>

      {/* QUICK SIMULATION SCENARIO SWITCHER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Real-Time Simulation Mode & Fault Injector
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Zero Hardware Demo Mode
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate realistic physics-based sensor patterns to test DNN inference instantly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSimulation}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                isSimulating
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Continuous Sim: ON' : 'Continuous Sim: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Fault Buttons */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'NORMAL', label: 'Normal (18.5V, 2.1A)', bg: 'hover:border-emerald-500/60' },
            { id: 'SHADING', label: 'Partial Shading', bg: 'hover:border-amber-500/60' },
            { id: 'DUST', label: 'Dust / Soiled', bg: 'hover:border-purple-500/60' },
            { id: 'ELECTRICAL_FAULT', label: 'Electrical Fault', bg: 'hover:border-rose-500/60' },
            { id: 'LOW_POWER', label: 'Low Power', bg: 'hover:border-orange-500/60' },
            { id: 'OVERHEATING', label: 'Overheating (>60°C)', bg: 'hover:border-red-500/60' }
          ].map((btn) => (
            <button
              key={btn.id}
              disabled={scenarioLoading}
              onClick={() => handleTriggerScenario(btn.id as FaultType)}
              className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200 transition-all hover:scale-105 disabled:opacity-50 text-center ${btn.bg}`}
            >
              <div className="font-mono text-white text-xs">{btn.id}</div>
              <div className="text-[10px] text-slate-400 mt-1">{btn.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
