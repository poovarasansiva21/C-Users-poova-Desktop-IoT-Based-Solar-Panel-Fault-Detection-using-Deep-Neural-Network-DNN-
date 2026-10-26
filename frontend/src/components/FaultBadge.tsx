import React from 'react';
import { FaultType, SeverityLevel } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, Sun, CloudRain, Flame } from 'lucide-react';

interface FaultBadgeProps {
  fault: FaultType | string;
  severity?: SeverityLevel;
  className?: string;
  showIcon?: boolean;
}

export const FaultBadge: React.FC<FaultBadgeProps> = ({
  fault,
  className = '',
  showIcon = true
}) => {
  const normalized = fault?.toUpperCase().replace(/\s+/g, '_') || 'NORMAL';

  let config = {
    label: 'Normal Operation',
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2
  };

  switch (normalized) {
    case 'SHADING':
      config = {
        label: 'Partial Shading',
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: CloudRain
      };
      break;
    case 'DUST':
    case 'DUST/DIRTY':
    case 'DIRT':
      config = {
        label: 'Dust / Soiled',
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        icon: Sun
      };
      break;
    case 'ELECTRICAL_FAULT':
    case 'ELECTRICAL':
      config = {
        label: 'Electrical Fault',
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: AlertOctagon
      };
      break;
    case 'LOW_POWER':
      config = {
        label: 'Low Power Yield',
        bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        icon: AlertTriangle
      };
      break;
    case 'OVERHEATING':
      config = {
        label: 'Overheating Hotspot',
        bg: 'bg-red-500/10 text-red-400 border-red-500/30',
        icon: Flame
      };
      break;
    default:
      break;
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
