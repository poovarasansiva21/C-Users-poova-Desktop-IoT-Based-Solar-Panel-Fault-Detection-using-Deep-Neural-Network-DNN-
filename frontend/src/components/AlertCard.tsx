import React from 'react';
import { AlertItem } from '../types';
import { AlertTriangle, AlertOctagon, Info, CheckCircle2, Clock, Wrench } from 'lucide-react';

interface AlertCardProps {
  alert: AlertItem;
  onStatusChange?: (alertId: number, newStatus: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED') => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onStatusChange }) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return {
          border: 'border-rose-500/40 bg-rose-950/20',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: AlertOctagon,
          iconColor: 'text-rose-400'
        };
      case 'HIGH':
        return {
          border: 'border-orange-500/40 bg-orange-950/20',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          icon: AlertTriangle,
          iconColor: 'text-orange-400'
        };
      case 'MEDIUM':
        return {
          border: 'border-amber-500/40 bg-amber-950/20',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertTriangle,
          iconColor: 'text-amber-400'
        };
      default:
        return {
          border: 'border-blue-500/40 bg-blue-950/20',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: Info,
          iconColor: 'text-blue-400'
        };
    }
  };

  const style = getSeverityStyle(alert.severity);
  const Icon = style.icon;

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 hover:border-slate-500 ${style.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 ${style.iconColor} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.badge}`}>
                {alert.severity} SEVERITY
              </span>
              <span className="text-xs font-semibold text-slate-300 font-mono">
                {alert.fault_type}
              </span>
            </div>
            <h4 className="mt-1.5 text-sm font-semibold text-white">
              {alert.message}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{alert.formatted_time || new Date(alert.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {alert.recommendation && (
        <div className="mt-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-400 font-medium">Recommendation: </strong>
            {alert.recommendation}
          </div>
        </div>
      )}

      {onStatusChange && alert.status === 'ACTIVE' && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => onStatusChange(alert.id, 'ACKNOWLEDGED')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Acknowledge
          </button>
          <button
            onClick={() => onStatusChange(alert.id, 'RESOLVED')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
};
