import React, { useState, useEffect } from 'react';
import { SensorReading } from '../types';
import { api } from '../services/api';
import { EfficiencyCard } from '../components/EfficiencyCard';
import {
  Gauge,
  TrendingUp,
  BarChart3,
  Calendar,
  Zap,
  ArrowDownRight,
  Sun
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AnalyticsProps {
  latestSensor: SensorReading | null;
}

export const Analytics: React.FC<AnalyticsProps> = ({ latestSensor }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

  const actualPower = latestSensor?.power || 38.85;
  const expectedPower = latestSensor?.expected_power || 42.0;
  const light = latestSensor?.light_intensity || 850;

  // Daily Hourly Comparison Data
  const dailyData = [
    { time: '06:00', actual: 4.2, expected: 5.0, efficiency: 84.0 },
    { time: '08:00', actual: 16.8, expected: 18.5, efficiency: 90.8 },
    { time: '10:00', actual: 29.5, expected: 32.0, efficiency: 92.2 },
    { time: '12:00', actual: 39.8, expected: 42.5, efficiency: 93.6 },
    { time: '14:00', actual: 38.2, expected: 41.0, efficiency: 93.2 },
    { time: '16:00', actual: 24.1, expected: 27.0, efficiency: 89.3 },
    { time: '18:00', actual: 7.5, expected: 9.0, efficiency: 83.3 }
  ];

  // Weekly Energy Production Data
  const weeklyData = [
    { day: 'Mon', yieldKWh: 0.28, lossKWh: 0.03, avgEfficiency: 91.5 },
    { day: 'Tue', yieldKWh: 0.31, lossKWh: 0.02, avgEfficiency: 93.8 },
    { day: 'Wed', yieldKWh: 0.24, lossKWh: 0.08, avgEfficiency: 75.0 }, // Dust event
    { day: 'Thu', yieldKWh: 0.29, lossKWh: 0.04, avgEfficiency: 89.2 },
    { day: 'Fri', yieldKWh: 0.32, lossKWh: 0.02, avgEfficiency: 94.1 },
    { day: 'Sat', yieldKWh: 0.30, lossKWh: 0.03, avgEfficiency: 92.4 },
    { day: 'Sun', yieldKWh: 0.33, lossKWh: 0.01, avgEfficiency: 95.5 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-emerald-400">
            <span>Performance Ratios</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Yield & Degradation Modeling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Efficiency Analysis & Energy Yield
          </h1>
        </div>

        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-3 py-1.5 rounded-lg transition ${
              period === 'daily'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Today Hourly
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-lg transition ${
              period === 'weekly'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            7-Day Weekly
          </button>
        </div>
      </div>

      {/* Main Dynamic Efficiency Card */}
      <EfficiencyCard
        actualPower={actualPower}
        expectedPower={expectedPower}
        lightIntensity={light}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actual vs Expected Power Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Actual vs Theoretical Power (W)
              </h3>
              <p className="text-xs text-slate-400">Comparing active generated wattage to irradiance benchmark</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="actual" name="Actual Power (W)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expected" name="Theoretical (W)" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Trend Line */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Efficiency Trend Line (%)
              </h3>
              <p className="text-xs text-slate-400">Performance ratio: (Actual / Expected) × 100</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">PR &gt; 90%</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={period === 'daily' ? dailyData : weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={period === 'daily' ? 'time' : 'day'} stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line
                  type="monotone"
                  dataKey={period === 'daily' ? 'efficiency' : 'avgEfficiency'}
                  name="Efficiency (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Energy Loss & Technical Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase">Estimated Power Deficit</span>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400 flex items-baseline gap-1">
            -{Math.max(0, expectedPower - actualPower).toFixed(2)} <span className="text-xs text-slate-400">W</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Due to soiling or environmental losses</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase">Temperature Derating Factor</span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            -0.41% / °C
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Standard monocrystalline silicon coeff</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase">Cumulative Daily Energy</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white flex items-baseline gap-1">
            0.312 <span className="text-xs text-slate-400">kWh</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Nominal production curve</span>
        </div>
      </div>
    </div>
  );
};
