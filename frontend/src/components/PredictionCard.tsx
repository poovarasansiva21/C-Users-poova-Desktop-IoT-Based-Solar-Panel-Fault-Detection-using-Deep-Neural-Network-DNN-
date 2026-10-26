import React, { useEffect, useRef } from 'react';
import { PredictionResult } from '../types';
import { FaultBadge } from './FaultBadge';
import { Cpu, ShieldCheck, ShieldAlert, Activity, Sparkles, CheckCircle } from 'lucide-react';
import { animateConfidenceBar } from '../animations/aiAnimations';

interface PredictionCardProps {
  result: PredictionResult;
  isLoading?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ result, isLoading }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const confidencePct = Math.round(result.confidence * 1000) / 10;

  useEffect(() => {
    if (barRef.current) {
      animateConfidenceBar(barRef.current, confidencePct);
    }
  }, [confidencePct]);

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-slate-700/60 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              DNN Fault Diagnosis
              <span className="text-xs font-mono font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {result.model_version}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Multi-class inference with softmax distribution</p>
          </div>
        </div>

        <FaultBadge fault={result.prediction} severity={result.severity} className="text-sm px-3 py-1" />
      </div>

      {/* Main Prediction & Confidence */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Result & Confidence */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Prediction Confidence
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-white">
              {confidencePct.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              High Certainty
            </span>
          </div>

          {/* Animated Bar */}
          <div className="mt-3">
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                ref={barRef}
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Diagnosed Condition:</span>
            <span className="font-semibold text-slate-200">{result.title}</span>
          </div>
        </div>

        {/* Right: Technical Recommendation */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              System Action & Recommendation
            </span>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="text-slate-500">Root Cause Analysis: </span>
            {result.description}
          </div>
        </div>
      </div>

      {/* Probability Distribution Breakdown */}
      {result.probabilities && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Softmax Class Probability Distribution
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {Object.entries(result.probabilities).map(([cname, prob]) => {
              const pct = (prob * 100).toFixed(1);
              const isTop = cname === result.prediction;
              return (
                <div
                  key={cname}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isTop
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[11px] truncate">{cname}</span>
                    {isTop && <CheckCircle className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="text-base font-bold font-mono text-white">{pct}%</div>
                  <div className="mt-1.5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isTop ? 'bg-amber-400' : 'bg-slate-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Autoencoder Anomaly Section */}
      {result.autoencoder && (
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            {result.autoencoder.anomaly ? (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="font-semibold text-slate-200">Autoencoder Anomaly Baseline: </span>
              <span className={result.autoencoder.anomaly ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {result.autoencoder.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-slate-400 text-[11px]">
            <span>Reconstruction MSE: <strong className="text-white">{result.autoencoder.reconstruction_error}</strong></span>
            <span>Threshold: <strong className="text-slate-300">{result.autoencoder.threshold}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
