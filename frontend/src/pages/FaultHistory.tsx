import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaultHistoryItem } from '../types';
import { FaultBadge } from '../components/FaultBadge';
import {
  AlertTriangle,
  Filter,
  RefreshCw,
  Wrench,
  CheckCircle2,
  Download
} from 'lucide-react';

export const FaultHistory: React.FC = () => {
  const [faults, setFaults] = useState<FaultHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const loadFaults = async () => {
    setLoading(true);
    try {
      const data = await api.getFaults(selectedFilter);
      setFaults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaults();
  }, [selectedFilter]);

  const categories = [
    { id: 'ALL', label: 'All Faults' },
    { id: 'SHADING', label: 'Shading' },
    { id: 'DUST', label: 'Dust / Dirty' },
    { id: 'ELECTRICAL_FAULT', label: 'Electrical Fault' },
    { id: 'LOW_POWER', label: 'Low Power' },
    { id: 'OVERHEATING', label: 'Overheating' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-rose-400">
            <span>Diagnostic Audit</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Solar Failure Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fault Detection History & Event Log
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadFaults}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Fault Log"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedFilter(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              selectedFilter === c.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Fault Events Table */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Fault Type</th>
                <th className="py-3 px-3 font-semibold">Severity</th>
                <th className="py-3 px-3 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold">Power Loss (W)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Action & Remedy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {faults.length > 0 ? (
                faults.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-300">
                      <div>{f.time}</div>
                      <div className="text-[10px] text-slate-500">{f.date}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <FaultBadge fault={f.fault_type} severity={f.severity} className="text-[11px] py-0.5" />
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold">
                      <span
                        className={`text-xs ${
                          f.severity === 'CRITICAL'
                            ? 'text-rose-400'
                            : f.severity === 'HIGH'
                            ? 'text-orange-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {f.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {f.confidence}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-400 font-semibold whitespace-nowrap">
                      -{f.power_loss}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                          f.status === 'UNRESOLVED'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'UNRESOLVED' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300 max-w-xs truncate">
                      <div className="flex items-center gap-1.5" title={f.recommendation}>
                        <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{f.recommendation}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No faults logged matching the selected category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
