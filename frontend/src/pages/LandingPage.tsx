import React, { useEffect, useRef } from 'react';
import {
  Sun,
  Cpu,
  Brain,
  ShieldCheck,
  Activity,
  ArrowRight,
  Layers,
  Wifi,
  BarChart3,
  AlertTriangle,
  Zap,
  CheckCircle2,
  HardDrive,
  Database,
  CloudRain,
  Flame,
  AlertOctagon
} from 'lucide-react';
import { animateHeroTimeline } from '../animations/pageAnimations';
import { initScrollSection } from '../animations/scrollAnimations';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aiTechRef = useRef<HTMLDivElement>(null);
  const iotArchRef = useRef<HTMLDivElement>(null);
  const faultsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Hero timeline animation
    const heroCtx = animateHeroTimeline(heroRef.current);

    // 2. ScrollTrigger sections
    const s1 = initScrollSection(howItWorksRef.current);
    const s2 = initScrollSection(featuresRef.current);
    const s3 = initScrollSection(aiTechRef.current);
    const s4 = initScrollSection(iotArchRef.current);
    const s5 = initScrollSection(faultsRef.current);
    const s6 = initScrollSection(benefitsRef.current);
    const s7 = initScrollSection(stackRef.current);

    return () => {
      heroCtx?.revert();
      s1?.revert();
      s2?.revert();
      s3?.revert();
      s4?.revert();
      s5?.revert();
      s6?.revert();
      s7?.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b101b]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">
              Smart SolarGuard
            </h1>
            <span className="text-[10px] font-mono text-amber-400 font-semibold tracking-wider">
              AI + IoT SOLAR DEFENSE
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-amber-400 transition">How It Works</a>
          <a href="#features" className="hover:text-amber-400 transition">Features</a>
          <a href="#ai-tech" className="hover:text-amber-400 transition">AI Model</a>
          <a href="#iot-arch" className="hover:text-amber-400 transition">IoT Architecture</a>
          <a href="#faults" className="hover:text-amber-400 transition">Fault Types</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition hover:scale-105"
          >
            Launch Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="pt-32 pb-20 px-6 lg:px-16 relative overflow-hidden bg-grid-pattern flex flex-col items-center justify-center min-h-[90vh]"
      >
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Brain className="w-3.5 h-3.5" /> AI-Powered DNN
          </span>
          <span className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-3.5 h-3.5" /> IoT-Enabled (ESP32)
          </span>
          <span className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5" /> Real-Time Telemetry
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center tracking-tight text-white max-w-4xl leading-[1.15]">
          Smart SolarGuard
        </h1>
        <p className="hero-subtitle text-lg sm:text-xl text-center text-slate-400 max-w-2xl mt-4 font-normal leading-relaxed">
          IoT-Based Solar Panel Fault Detection Using Deep Neural Networks
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hero-btn px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center gap-2 transition hover:scale-105"
          >
            <Zap className="w-4 h-4" /> Start Monitoring
          </button>
          <button
            onClick={() => onNavigate('model')}
            className="hero-btn px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 flex items-center gap-2 transition hover:scale-105"
          >
            <Layers className="w-4 h-4 text-amber-400" /> Explore AI Model
          </button>
        </div>

        {/* HERO VISUAL PIPELINE: Solar Panel -> Sensors -> ESP32 -> AI / DNN -> Fault Detection */}
        <div className="mt-16 w-full max-w-5xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl relative">
          <div className="text-center mb-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-400">
              End-to-End Autonomous Data Flow
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {/* 1. Solar Panel */}
            <div className="flow-solar p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center flex flex-col items-center justify-center relative group">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 mb-2">
                <Sun className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wide">Solar Panel</h4>
              <span className="text-[11px] font-mono text-slate-400 mt-1">PV String Generator</span>
              <span className="text-[10px] text-emerald-400 font-mono mt-1">18-20V • 2.1A</span>
            </div>

            {/* 2. Sensors */}
            <div className="flow-sensors p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center flex flex-col items-center justify-center relative">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-2">
                <Activity className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wide">Sensors</h4>
              <span className="text-[11px] font-mono text-slate-400 mt-1">V, I, Temp, LDR</span>
              <span className="text-[10px] text-cyan-400 font-mono mt-1">Analog Sampling</span>
            </div>

            {/* 3. ESP32 */}
            <div className="flow-esp32 p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 text-center flex flex-col items-center justify-center relative">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
                <Cpu className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wide">ESP32 MCU</h4>
              <span className="text-[11px] font-mono text-slate-400 mt-1">Wi-Fi Telemetry</span>
              <span className="text-[10px] text-indigo-400 font-mono mt-1">HTTP REST POST</span>
            </div>

            {/* 4. AI / DNN */}
            <div className="flow-dnn p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-center flex flex-col items-center justify-center relative">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 mb-2">
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wide">AI / DNN</h4>
              <span className="text-[11px] font-mono text-slate-400 mt-1">6-Layer Classifier</span>
              <span className="text-[10px] text-purple-400 font-mono mt-1">Softmax Inference</span>
            </div>

            {/* 5. Fault Detection */}
            <div className="flow-detection p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 text-center flex flex-col items-center justify-center relative">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 mb-2">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wide">Fault Detection</h4>
              <span className="text-[11px] font-mono text-slate-400 mt-1">6 Fault Classes</span>
              <span className="text-[10px] text-rose-400 font-mono mt-1">Instant Alerting</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS */}
      <section id="how-it-works" ref={howItWorksRef} className="py-24 px-6 lg:px-16 border-t border-slate-800/80 max-w-7xl mx-auto">
        <div className="section-header text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            System Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            How Smart SolarGuard Works
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Continuous telemetry ingestion paired with deep neural network pattern recognition to guarantee optimal solar energy generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Multi-Sensor Sensing',
              desc: 'Voltage divider, ACS712 current module, LM35 temperature sensor, and LDR capture electrical and environmental parameters.',
              icon: Activity
            },
            {
              step: '02',
              title: 'Edge Ingestion & Wi-Fi',
              desc: 'ESP32 micro-controller packages telemetry into standardized JSON payloads and transmits to FastAPI backend over HTTP REST.',
              icon: Wifi
            },
            {
              step: '03',
              title: 'DNN Pattern Diagnosis',
              desc: 'Trained Deep Neural Network evaluates normalized 5-dimensional feature vectors to classify fault types with 97%+ confidence.',
              icon: Brain
            },
            {
              step: '04',
              title: 'Alert & Efficiency Action',
              desc: 'Instant visual alerts, power loss estimations, and maintenance recommendations are streamed directly to the real-time web dashboard.',
              icon: ShieldCheck
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="stagger-item glass-panel rounded-2xl p-6 relative border border-slate-800 hover:border-amber-500/40 transition">
                <span className="text-2xl font-extrabold font-mono text-amber-500/30 block mb-3">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-amber-400 mb-4 border border-slate-700/60">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: KEY FEATURES */}
      <section id="features" ref={featuresRef} className="py-24 px-6 lg:px-16 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="section-header text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Advanced Engineering Features
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Combining cutting-edge IoT edge compute with deep learning to protect renewable investments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-Time Telemetry Streaming',
                desc: 'Continuous tracking of Voltage, Current, Temperature, Light Intensity, and calculated Power with 3-second live refresh intervals.',
                icon: Activity
              },
              {
                title: '6-Class DNN Fault Classifier',
                desc: 'Identifies Normal, Partial Shading, Dust Accumulation, Electrical Faults, Low Power, and Thermal Overheating.',
                icon: Brain
              },
              {
                title: 'Autoencoder Anomaly Baseline',
                desc: 'Unsupervised Autoencoder detects out-of-distribution drift and novel faults via reconstruction error thresholding.',
                icon: Layers
              },
              {
                title: 'Dynamic Efficiency Analysis',
                desc: 'Compares active output power against theoretical irradiance yields to provide accurate performance ratios and energy loss.',
                icon: BarChart3
              },
              {
                title: 'Hardware Simulation Engine',
                desc: 'Built-in scenario simulator enables complete system demonstration, fault injection, and testing without physical solar hardware.',
                icon: Cpu
              },
              {
                title: 'Complete Historical Logging',
                desc: 'Persistent SQLite database logging every sensor reading and AI classification, with CSV data export and audit trails.',
                icon: Database
              }
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="stagger-item glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: FAULT DETECTION MATRIX */}
      <section id="faults" ref={faultsRef} className="py-24 px-6 lg:px-16 border-t border-slate-800/80 max-w-7xl mx-auto">
        <div className="section-header text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
            Intelligent Diagnostics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            6-Class Solar PV Fault Recognition
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Precise identification of real-world solar photovoltaic failures with actionable remediation guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'NORMAL',
              title: 'Normal Operation',
              desc: 'Optimal MPP voltage (18-20V), expected current, and balanced thermal metrics.',
              icon: CheckCircle2,
              color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            },
            {
              name: 'SHADING',
              title: 'Partial Shading',
              desc: 'Localized shadows from foliage or structures drastically bottleneck string current.',
              icon: CloudRain,
              color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            },
            {
              name: 'DUST',
              title: 'Dust / Soiled Surface',
              desc: 'High ambient sunlight, but glass soiling reduces transmittance and suppresses current.',
              icon: Sun,
              color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
            },
            {
              name: 'ELECTRICAL_FAULT',
              title: 'Electrical Fault',
              desc: 'Severe voltage collapse or open circuit caused by loose connectors or diode breakdown.',
              icon: AlertOctagon,
              color: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
            },
            {
              name: 'LOW_POWER',
              title: 'Low Power Yield',
              desc: 'Sub-optimal power output under adequate light; indicates cell degradation or mismatch.',
              icon: AlertTriangle,
              color: 'text-orange-400 border-orange-500/30 bg-orange-500/10'
            },
            {
              name: 'OVERHEATING',
              title: 'Thermal Hotspot',
              desc: 'Temperatures exceeding 55°C causing severe negative-coefficient voltage degradation.',
              icon: Flame,
              color: 'text-red-400 border-red-500/30 bg-red-500/10'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="stagger-item glass-panel rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${item.color}`}>
                    {item.name}
                  </span>
                  <Icon className={`w-5 h-5 ${item.color.split(' ')[0]}`} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: BENEFITS & TECH STACK */}
      <section id="ai-tech" ref={stackRef} className="py-24 px-6 lg:px-16 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto">
          <div className="section-header text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Technology Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Full-Stack Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Engineered with modern industry standards for high performance, reliability, and scientific rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stagger-item p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">Frontend</h3>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li>• React 18 + TypeScript</li>
                <li>• Vite Build Engine</li>
                <li>• Tailwind CSS Styling</li>
                <li>• GSAP + ScrollTrigger</li>
                <li>• Recharts Interactive SVGs</li>
                <li>• Lucide React Icons</li>
              </ul>
            </div>

            <div className="stagger-item p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Backend</h3>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li>• Python 3.11</li>
                <li>• FastAPI Framework</li>
                <li>• Uvicorn ASGI Server</li>
                <li>• Pydantic v2 Schemas</li>
                <li>• SQLite Database</li>
                <li>• SQLAlchemy ORM</li>
              </ul>
            </div>

            <div className="stagger-item p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4">AI & ML</h3>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li>• Deep Neural Network (DNN)</li>
                <li>• Dense(64-32-16) + Softmax</li>
                <li>• Baseline Autoencoder</li>
                <li>• Scikit-learn Preprocessing</li>
                <li>• StandardScaler Pipeline</li>
                <li>• Multi-Class Softmax</li>
              </ul>
            </div>

            <div className="stagger-item p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">IoT & Edge</h3>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li>• ESP32 Dev Board (WROOM-32)</li>
                <li>• Voltage Divider Sensor</li>
                <li>• ACS712 Current Sensor</li>
                <li>• LM35 Temperature Sensor</li>
                <li>• LDR Light Sensor</li>
                <li>• Wi-Fi HTTP Telemetry</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 inline-flex items-center gap-2 transition hover:scale-105"
            >
              Enter Live Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-16 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          Smart SolarGuard © 2026. College Capstone Project in IoT & Deep Learning.
        </div>
        <div className="font-mono text-slate-400 text-[11px]">
          Target Hardware: ESP-WROOM-32 | Model: SolarGuard DNN v1.0
        </div>
      </footer>
    </div>
  );
};
