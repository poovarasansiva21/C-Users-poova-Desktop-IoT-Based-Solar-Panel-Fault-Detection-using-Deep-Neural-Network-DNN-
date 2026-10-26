import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Activity } from 'lucide-react';

interface AutoencoderCardProps {
  reconstructionError: number;
  threshold: number;
  isAnomaly: boolean;
  statusText?: string;
}

export const AutoencoderCard: React.FC<AutoencoderCardProps> = ({
  reconstructionError = 0.083,
  threshold = 0.100,
  isAnomaly = false,
  statusText = 'NORMAL'
}) => {
  const percentage = Math.min(100, (reconstructionError / (threshold * 1.5)) * 100);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Autoencoder Baseline Anomaly Detector
              <span className="text-xs font-mono font-normal text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Unsupervised
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Learns normal operating patterns and flags out-of-distribution drift via reconstruction loss
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            isAnomaly
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isAnomaly ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          {isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL PATTERN'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase">Reconstruction Error (MSE)</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {reconstructionError.toFixed(3)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">||x - x_reconstructed||²</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase">Anomaly Threshold</span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            {threshold.toFixed(3)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">95th Percentile baseline cutoff</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase">Anomaly Status</span>
          <div
            className={`mt-2 text-2xl font-bold font-mono ${
              isAnomaly ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {statusText}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isAnomaly ? 'Loss exceeds threshold' : 'Within normal boundaries'}
          </span>
        </div>
      </div>

      {/* Threshold Comparison Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
          <span>Reconstruction Loss Level</span>
          <span>
            {reconstructionError.toFixed(3)} / {threshold.toFixed(3)} Threshold
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 ${
              isAnomaly ? 'bg-rose-500' : 'bg-emerald-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
