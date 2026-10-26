import React, { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { animateSensorValue } from '../animations/dashboardAnimations';

interface SensorCardProps {
  name: string;
  pin: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  icon: LucideIcon;
  color: string;
  decimals?: number;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  name,
  pin,
  value,
  unit,
  min,
  max,
  icon: Icon,
  color,
  decimals = 2
}) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef<number>(value);

  useEffect(() => {
    if (valueRef.current) {
      animateSensorValue(valueRef.current, prevValue.current, value, decimals);
      prevValue.current = value;
    }
  }, [value, decimals]);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{name}</h4>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/40">
              {pin}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Active</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span ref={valueRef} className="text-3xl font-bold font-mono tracking-tight text-white">
          {value.toFixed(decimals)}
        </span>
        <span className="text-sm font-mono text-slate-400">{unit}</span>
      </div>

      {/* Progress Bar Range Indicator */}
      <div className="mt-3">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-mono text-slate-500">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    </div>
  );
};
