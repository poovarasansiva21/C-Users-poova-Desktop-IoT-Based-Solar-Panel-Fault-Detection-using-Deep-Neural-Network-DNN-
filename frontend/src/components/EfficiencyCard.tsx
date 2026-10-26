import React from 'react';
import { Gauge, Zap, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';

interface EfficiencyCardProps {
  actualPower: number;
  expectedPower: number;
  lightIntensity: number;
}

export const EfficiencyCard: React.FC<EfficiencyCardProps> = ({
  actualPower,
  expectedPower,
  lightIntensity
}) => {
  const safeExpected = Math.max(1.0, expectedPower);
  const efficiency = Math.min(100.0, Math.max(0.0, (actualPower / safeExpected) * 100.0));
  const powerLoss = Math.max(0.0, safeExpected - actualPower);

  let statusText = 'GOOD';
  let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (efficiency < 65.0) {
    statusText = 'POOR / DEGRADED';
    statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (efficiency < 85.0) {
    statusText = 'FAIR';
    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-slate-700/60">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Solar Panel Efficiency Rating</h3>
            <p className="text-xs text-slate-400">Dynamic comparison against theoretical irradiance yield</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase">Current Power</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white flex items-baseline gap-1">
            {actualPower.toFixed(2)} <span className="text-xs text-slate-400">W</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active load output</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase">Expected Yield</span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400 flex items-baseline gap-1">
            {expectedPower.toFixed(2)} <span className="text-xs text-slate-400">W</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Based on {lightIntensity.toFixed(0)} lx irradiance</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase">Real-Time Efficiency</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
            {efficiency.toFixed(1)} <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[11px] text-rose-400/80 mt-1 block">Loss: -{powerLoss.toFixed(2)} W</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
          <span>Performance Ratio</span>
          <span>{efficiency.toFixed(1)}% / 100%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${
              efficiency >= 85
                ? 'bg-emerald-400'
                : efficiency >= 65
                ? 'bg-amber-400'
                : 'bg-rose-500'
            }`}
            style={{ width: `${efficiency}%` }}
          />
        </div>
      </div>
    </div>
  );
};
