import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaultBadge } from '../components/FaultBadge';
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Database,
  Calendar
} from 'lucide-react';

export const SensorHistory: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFault, setSelectedFault] = useState('ALL');
  const [timeRange, setTimeRange] = useState('30m');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getSensorHistory(timeRange, 500, selectedFault);
      if (res.data) {
        setData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange, selectedFault]);

  // Client-side search filtering
  const filtered = data.filter((item) => {
    const matchSearch =
      item.time?.includes(search) ||
      item.prediction?.toLowerCase().includes(search.toLowerCase()) ||
      item.device_id?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // CSV Export Function
  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = ['Timestamp', 'Voltage (V)', 'Current (A)', 'Temperature (C)', 'Light (lx)', 'Power (W)', 'Prediction', 'Confidence (%)'];
    const rows = data.map((d) => [
      d.timestamp,
      d.voltage,
      d.current,
      d.temperature,
      d.light_intensity,
      d.power,
      d.prediction,
      d.confidence
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solar_sensor_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <span>Historical Telemetry</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Database Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sensor Telemetry & AI Predictions History
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition hover:scale-105"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-700/60 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search timestamp, condition, device..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Fault Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFault}
              onChange={(e) => {
                setSelectedFault(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Faults</option>
              <option value="NORMAL" className="bg-slate-900">Normal</option>
              <option value="SHADING" className="bg-slate-900">Shading</option>
              <option value="DUST" className="bg-slate-900">Dust</option>
              <option value="ELECTRICAL_FAULT" className="bg-slate-900">Electrical Fault</option>
              <option value="LOW_POWER" className="bg-slate-900">Low Power</option>
              <option value="OVERHEATING" className="bg-slate-900">Overheating</option>
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
            >
              <option value="5m" className="bg-slate-900">Last 5 Minutes</option>
              <option value="30m" className="bg-slate-900">Last 30 Minutes</option>
              <option value="1h" className="bg-slate-900">Last 1 Hour</option>
              <option value="today" className="bg-slate-900">Today</option>
              <option value="all" className="bg-slate-900">All Time</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <strong>{filtered.length}</strong> records
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-3 font-semibold">Voltage (V)</th>
                <th className="py-3 px-3 font-semibold">Current (A)</th>
                <th className="py-3 px-3 font-semibold">Temp (°C)</th>
                <th className="py-3 px-3 font-semibold">Light (lx)</th>
                <th className="py-3 px-3 font-semibold">Power (W)</th>
                <th className="py-3 px-4 font-semibold">DNN Prediction</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {paginated.length > 0 ? (
                paginated.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {row.time || new Date(row.timestamp).toLocaleTimeString()}
                      <span className="text-[10px] text-slate-500 block font-sans">
                        {row.date || new Date(row.timestamp).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">{row.voltage.toFixed(2)}</td>
                    <td className="py-3 px-3 text-cyan-300 font-bold">{row.current.toFixed(2)}</td>
                    <td className="py-3 px-3 text-rose-300">{row.temperature.toFixed(1)}</td>
                    <td className="py-3 px-3 text-yellow-300">{row.light_intensity.toFixed(0)}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{row.power.toFixed(2)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <FaultBadge fault={row.prediction} className="text-[11px] py-0.5" />
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-bold">
                      {row.confidence}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No sensor readings found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
