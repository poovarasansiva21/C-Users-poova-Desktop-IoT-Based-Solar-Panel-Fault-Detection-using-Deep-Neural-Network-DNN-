import React, { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { animateSensorValue } from '../animations/dashboardAnimations';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  iconColor?: string;
  decimals?: number;
  subtitle?: string;
  trend?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  iconColor = 'text-amber-400',
  decimals = 2,
  subtitle,
  trend,
  highlight = false
}) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    if (valueRef.current) {
      animateSensorValue(valueRef.current, prevValueRef.current, value, decimals);
      prevValueRef.current = value;
    }
  }, [value, decimals]);

  return (
    <div
      className={`glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:border-amber-500/40 group ${
        highlight ? 'ring-1 ring-amber-500/30' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          ref={valueRef}
          className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white"
        >
          {value.toFixed(decimals)}
        </span>
        <span className="text-sm font-medium text-slate-400 font-mono">{unit}</span>
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {trend && <span className="text-emerald-400 font-mono font-medium">{trend}</span>}
        </div>
      )}
    </div>
  );
};
