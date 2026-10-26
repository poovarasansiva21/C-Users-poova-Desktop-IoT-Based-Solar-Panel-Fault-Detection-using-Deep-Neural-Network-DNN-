import React, { useState, useRef } from 'react';
import { SensorReading, PredictionResult } from '../types';
import { api } from '../services/api';
import { PredictionCard } from '../components/PredictionCard';
import { runAIPipelineAnimation } from '../animations/aiAnimations';
import {
  Brain,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  Thermometer,
  Sun,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Play
} from 'lucide-react';

interface AiDetectionProps {
  latestSensor: SensorReading | null;
  onRefresh: () => void;
}

export const AiDetection: React.FC<AiDetectionProps> = ({ latestSensor, onRefresh }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [customInputs, setCustomInputs] = useState({
    voltage: latestSensor?.voltage || 18.5,
    current: latestSensor?.current || 2.1,
    temperature: latestSensor?.temperature || 32.4,
    light_intensity: latestSensor?.light_intensity || 850
  });

  const steps = [
    'Collecting Telemetry Vector',
    'StandardScaler Normalization',
    'DNN Feedforward Pass (64→32→16)',
    'Softmax & Autoencoder Analysis',
    'Fault Diagnosis Finalized'
  ];

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setCurrentStep(1);

    const v = customInputs.voltage;
    const i = customInputs.current;
    const t = customInputs.temperature;
    const l = customInputs.light_intensity;
    const p = Math.round(v * i * 100) / 100;

    // Animate through pipeline steps
    runAIPipelineAnimation(
      (stepNum) => {
        setCurrentStep(stepNum);
      },
      async () => {
        try {
          const res = await api.runPrediction({
            voltage: v,
            current: i,
            temperature: t,
            light_intensity: l,
            power: p
          });
          setPredictionResult(res);
          onRefresh();
        } catch (err) {
          console.error('Prediction failed', err);
        } finally {
          setAnalyzing(false);
        }
      }
    );
  };

  const handleUseLatest = () => {
    if (latestSensor) {
      setCustomInputs({
        voltage: latestSensor.voltage,
        current: latestSensor.current,
        temperature: latestSensor.temperature,
        light_intensity: latestSensor.light_intensity
      });
    }
  };

  const power = Math.round(customInputs.voltage * customInputs.current * 100) / 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-purple-400">
            <span>Neural Inference Engine</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">SolarGuard DNN v1.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Fault Detection & Neural Inference
          </h1>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center gap-2 transition hover:scale-105 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Running DNN Inference...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run AI Analysis
            </>
          )}
        </button>
      </div>

      {/* Input Features Card with Sliders / Inputs */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Input Feature Vector (5-Dimensional)
            </h3>
            <p className="text-xs text-slate-400">Features fed directly into the Deep Neural Network</p>
          </div>
          <button
            onClick={handleUseLatest}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Latest Telemetry
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Voltage */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Voltage (V)</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <input
              type="number"
              step="0.1"
              value={customInputs.voltage}
              onChange={(e) => setCustomInputs({ ...customInputs, voltage: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Expected: 18–20.5V</span>
          </div>

          {/* Current */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Current (A)</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <input
              type="number"
              step="0.05"
              value={customInputs.current}
              onChange={(e) => setCustomInputs({ ...customInputs, current: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Expected: 1.8–2.3A</span>
          </div>

          {/* Temperature */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Temperature (°C)</span>
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <input
              type="number"
              step="0.5"
              value={customInputs.temperature}
              onChange={(e) => setCustomInputs({ ...customInputs, temperature: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Threshold: &lt;50°C</span>
          </div>

          {/* Light Intensity */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Light (lx)</span>
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <input
              type="number"
              step="10"
              value={customInputs.light_intensity}
              onChange={(e) => setCustomInputs({ ...customInputs, light_intensity: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Sunlight: 700–1000 lx</span>
          </div>

          {/* Power (V x I) */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Power (W)</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 font-mono text-sm font-bold text-emerald-400">
              {power.toFixed(2)} W
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Auto: V × I</span>
          </div>
        </div>
      </div>

      {/* GSAP Pipeline Animated Stepper */}
      {analyzing && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/40 shadow-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            Executing Deep Neural Inference Pipeline
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {steps.map((s, idx) => {
              const active = currentStep === idx + 1;
              const done = currentStep > idx + 1;
              return (
                <div
                  key={s}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                      : done
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold">0{idx + 1}</span>
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="font-medium text-[11px]">{s}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prediction Showcase */}
      {predictionResult ? (
        <PredictionCard result={predictionResult} isLoading={analyzing} />
      ) : latestSensor?.prediction ? (
        <PredictionCard
          result={{
            prediction: latestSensor.prediction.condition,
            confidence: latestSensor.prediction.confidence,
            severity: latestSensor.prediction.severity,
            title: `${latestSensor.prediction.condition} Condition`,
            description: 'Automated background DNN classification on continuous telemetry stream.',
            recommendation: latestSensor.prediction.recommendation,
            probabilities: latestSensor.prediction.probabilities || {
              NORMAL: 0.965,
              SHADING: 0.015,
              DUST: 0.01,
              ELECTRICAL_FAULT: 0.005,
              LOW_POWER: 0.003,
              OVERHEATING: 0.002
            },
            autoencoder: {
              reconstruction_error: 0.083,
              threshold: 0.100,
              anomaly: false,
              status: 'NORMAL'
            },
            model_version: 'SolarGuard DNN v1.0',
            input_features: {
              voltage: customInputs.voltage,
              current: customInputs.current,
              temperature: customInputs.temperature,
              light_intensity: customInputs.light_intensity,
              power: power
            }
          }}
        />
      ) : null}
    </div>
  );
};
