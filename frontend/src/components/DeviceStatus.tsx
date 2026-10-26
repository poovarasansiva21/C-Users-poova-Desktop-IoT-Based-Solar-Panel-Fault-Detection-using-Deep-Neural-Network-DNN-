import React, { useState } from 'react';
import { DeviceItem } from '../types';
import { api } from '../services/api';
import { Wifi, Cpu, CheckCircle, RefreshCw, Radio, HardDrive } from 'lucide-react';

interface DeviceStatusProps {
  device?: DeviceItem;
  onRefresh?: () => void;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({ device, onRefresh }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.testDeviceConnection();
      setTestResult(`Success: Ping ${res.ping_ms}ms, Wi-Fi: ${res.wi_fi_strength_rssi}`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setTestResult('Error: Failed to ping device');
    } finally {
      setTesting(false);
    }
  };

  const isConnected = device?.status === 'CONNECTED' || device?.status === 'SIMULATED';

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {device?.device_name || 'ESP32 Solar Monitor'}
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                {device?.device_id || 'ESP32-SOLAR-001'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Edge microcontroller telemetry transmitter</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {device?.status || 'CONNECTED'}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Wi-Fi Connection</span>
          <div className="flex items-center gap-2 text-white font-semibold">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>CONNECTED (WLAN)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            IP: {device?.ip_address || '192.168.1.105'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Telemetry Status</span>
          <div className="flex items-center gap-2 text-white font-semibold">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Active Stream</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            Rate: 1 packet / 3 sec
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Firmware</span>
          <div className="flex items-center gap-2 text-white font-semibold">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>{device?.firmware_version || 'ESP32-SG-v1.2'}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            Free Heap: 184 KB
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Heartbeat</span>
          <div className="text-white font-semibold font-mono">
            {device?.last_seen ? new Date(device.last_seen).toLocaleTimeString() : '2s ago'}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">● Keep-alive active</span>
        </div>
      </div>

      {/* Connected Sensors List */}
      <div className="mt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Configured Sensor Interfaces
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Voltage Divider (0-25V)', pin: 'GPIO 34', status: 'OK' },
            { name: 'Current ACS712', pin: 'GPIO 35', status: 'OK' },
            { name: 'Temperature LM35', pin: 'GPIO 33', status: 'OK' },
            { name: 'LDR Light Sensor', pin: 'GPIO 32', status: 'OK' }
          ].map((s) => (
            <div
              key={s.name}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <div className="text-slate-200 font-medium">{s.name}</div>
                <div className="font-mono text-[11px] text-slate-500">{s.pin}</div>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          {testing ? 'Testing Connectivity...' : 'Test Connection'}
        </button>

        {testResult && (
          <span className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {testResult}
          </span>
        )}
      </div>
    </div>
  );
};
