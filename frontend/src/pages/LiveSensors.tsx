import React, { useState, useEffect } from 'react';
import { SensorReading } from '../types';
import { api } from '../services/api';
import { SensorCard } from '../components/SensorCard';
import {
  Activity,
  Zap,
  Thermometer,
  Sun,
  Clock,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface LiveSensorsProps {
  latestSensor: SensorReading | null;
  onRefresh: () => void;
}

export const LiveSensors: React.FC<LiveSensorsProps> = ({ latestSensor, onRefresh }) => {
  const [timeRange, setTimeRange] = useState<string>('5m');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getSensorHistory(timeRange, 60);
      if (res.chronological) {
        setHistoryData(res.chronological);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const v = latestSensor?.voltage || 18.5;
  const i = latestSensor?.current || 2.1;
  const t = latestSensor?.temperature || 32.4;
  const l = latestSensor?.light_intensity || 850;
  const p = latestSensor?.power || 38.85;

  const ranges = [
    { id: '1m', label: '1 Min' },
    { id: '5m', label: '5 Min' },
    { id: '30m', label: '30 Min' },
    { id: '1h', label: '1 Hour' },
    { id: 'today', label: 'Today' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-amber-400">
            <span>Sensors & Telemetry</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Real-Time Waveforms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Sensor Waveforms & Instruments
          </h1>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-slate-400 ml-2 mr-1" />
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  timeRange === r.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchHistory}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Charts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 5 Sensor Hardware Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SensorCard
          name="Solar Voltage"
          pin="ADC1_CH6 (GPIO34)"
          value={v}
          unit="V"
          min={0}
          max={25}
          decimals={2}
          icon={Zap}
          color="text-amber-400"
        />
        <SensorCard
          name="Array Current"
          pin="ACS712 (GPIO35)"
          value={i}
          unit="A"
          min={0}
          max={5}
          decimals={2}
          icon={Activity}
          color="text-cyan-400"
        />
        <SensorCard
          name="Cell Temperature"
          pin="LM35 (GPIO33)"
          value={t}
          unit="°C"
          min={0}
          max={100}
          decimals={1}
          icon={Thermometer}
          color="text-rose-400"
        />
        <SensorCard
          name="Light Intensity"
          pin="LDR (GPIO32)"
          value={l}
          unit="lx"
          min={0}
          max={1200}
          decimals={0}
          icon={Sun}
          color="text-yellow-400"
        />
        <SensorCard
          name="Power Output"
          pin="Calculated (V×I)"
          value={p}
          unit="W"
          min={0}
          max={60}
          decimals={2}
          icon={Zap}
          color="text-emerald-400"
        />
      </div>

      {/* 5 Dedicated Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Voltage vs Time */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Voltage vs Time (V)
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold">{v.toFixed(2)} V</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="voltage" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Current vs Time */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Current vs Time (A)
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">{i.toFixed(2)} A</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="current" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Temperature vs Time */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Temperature vs Time (°C)
            </h3>
            <span className="text-xs font-mono text-rose-400 font-bold">{t.toFixed(1)} °C</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="temperature" stroke="#fb7185" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Light Intensity vs Time */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Light Intensity vs Time (lx)
            </h3>
            <span className="text-xs font-mono text-yellow-400 font-bold">{l.toFixed(0)} lx</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="light_intensity" stroke="#facc15" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Power Output vs Time (Spans full row) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Power Output vs Time (W)
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">{p.toFixed(2)} W</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="power" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
