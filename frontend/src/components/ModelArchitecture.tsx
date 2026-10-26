import React, { useEffect, useRef } from 'react';
import { animateNeuralFlow } from '../animations/aiAnimations';
import { Layers, ArrowDown, Cpu, Network, Zap } from 'lucide-react';

export const ModelArchitecture: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = animateNeuralFlow(containerRef.current);
    return () => ctx?.revert();
  }, []);

  const layers = [
    {
      name: 'Input Layer',
      units: '5 Neurons',
      features: ['Voltage (V)', 'Current (A)', 'Temp (°C)', 'Light (lx)', 'Power (W)'],
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
      dotColor: 'bg-cyan-400',
      activation: 'Raw Features'
    },
    {
      name: 'Dense Layer 1',
      units: '64 Neurons',
      details: 'ReLU Activation + Dropout (0.2)',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      dotColor: 'bg-amber-400',
      activation: 'ReLU + Dropout 20%'
    },
    {
      name: 'Dense Layer 2',
      units: '32 Neurons',
      details: 'ReLU Activation + Dropout (0.2)',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      dotColor: 'bg-emerald-400',
      activation: 'ReLU + Dropout 20%'
    },
    {
      name: 'Dense Layer 3',
      units: '16 Neurons',
      details: 'ReLU Activation',
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
      dotColor: 'bg-purple-400',
      activation: 'ReLU'
    },
    {
      name: 'Output Layer',
      units: '6 Classes',
      classes: ['NORMAL', 'SHADING', 'DUST', 'ELECTRICAL_FAULT', 'LOW_POWER', 'OVERHEATING'],
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
      dotColor: 'bg-rose-400',
      activation: 'Softmax Probability'
    }
  ];

  return (
    <div ref={containerRef} className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Deep Neural Network (DNN) Architecture
              <span className="text-xs font-mono font-normal text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Sequential MLP
              </span>
            </h3>
            <p className="text-xs text-slate-400">Layer-by-layer forward propagation diagram</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Live Synaptic Flow</span>
        </div>
      </div>

      {/* Layer Blocks Pipeline */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 relative">
        {layers.map((layer, index) => (
          <React.Fragment key={layer.name}>
            <div
              className={`w-full md:w-1/5 p-4 rounded-xl border ${layer.color} relative group transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  L{index + 1}
                </span>
                <span className="text-xs font-bold font-mono text-white">{layer.units}</span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{layer.name}</h4>
              <span className="text-[11px] font-mono text-slate-300 block mb-2">
                {layer.activation}
              </span>

              {/* Visual Simulated Neurons */}
              <div className="flex items-center justify-center gap-1 py-2">
                {[1, 2, 3, 4, 5].map((d) => (
                  <span
                    key={d}
                    className={`neuron-dot w-2 h-2 rounded-full ${layer.dotColor} opacity-70`}
                  />
                ))}
              </div>

              {/* Extra Layer Details */}
              {layer.features && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono space-y-0.5">
                  {layer.features.slice(0, 3).map((f) => (
                    <div key={f}>• {f}</div>
                  ))}
                  <div>+ 2 more</div>
                </div>
              )}

              {layer.classes && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono space-y-0.5">
                  <div>• NORMAL, SHADING</div>
                  <div>• DUST, ELECTRICAL</div>
                  <div>• LOW_POWER, OVERHEAT</div>
                </div>
              )}
            </div>

            {/* Connecting Connector Arrow between layers */}
            {index < layers.length - 1 && (
              <div className="flex items-center justify-center shrink-0 my-1 md:my-0">
                <div className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400">
                  →
                </div>
                <div className="flex md:hidden items-center justify-center w-6 h-6 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400">
                  ↓
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Summary specs footer */}
      <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 block">Total Trainable Params:</span>
          <span className="text-white font-mono font-bold">3,046 parameters</span>
        </div>
        <div>
          <span className="text-slate-500 block">Loss Function:</span>
          <span className="text-white font-mono font-bold">Sparse Categorical Cross-Entropy</span>
        </div>
        <div>
          <span className="text-slate-500 block">Optimizer:</span>
          <span className="text-white font-mono font-bold">Adam (lr=0.001)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Regularization:</span>
          <span className="text-white font-mono font-bold">Dropout (20%) + EarlyStopping</span>
        </div>
      </div>
    </div>
  );
};
