import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AlertItem } from '../types';
import { AlertCard } from '../components/AlertCard';
import {
  Bell,
  CheckCircle2,
  Filter,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ACTIVE');
  const [loading, setLoading] = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts(statusFilter);
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter]);

  const handleStatusChange = async (alertId: number, newStatus: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED') => {
    try {
      await api.updateAlertStatus(alertId, newStatus);
      loadAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-amber-400">
            <span>Incident Command</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Fault Remediation Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Active Alerts & Maintenance Dispatch
            {activeCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white font-mono">
                {activeCount} Active
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAlerts}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Alerts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold w-fit">
        <button
          onClick={() => setStatusFilter('ACTIVE')}
          className={`px-4 py-2 rounded-lg transition ${
            statusFilter === 'ACTIVE'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Incidents
        </button>
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-lg transition ${
            statusFilter === 'ALL'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Incidents
        </button>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((item) => (
            <AlertCard key={item.id} alert={item} onStatusChange={handleStatusChange} />
          ))
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Active Incidents</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All monitored solar panels are operating within optimal electrical and thermal boundaries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
