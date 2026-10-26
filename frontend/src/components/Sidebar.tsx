import React from 'react';
import {
  LayoutDashboard,
  Brain,
  Activity,
  BarChart3,
  History,
  AlertTriangle,
  Cpu,
  Layers,
  Bell,
  Settings,
  Sun,
  Home,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadAlertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  collapsed,
  onToggleCollapse,
  unreadAlertCount = 0
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-detection', label: 'AI Fault Detection', icon: Brain, badge: 'DNN' },
    { id: 'live-sensors', label: 'Live Sensors', icon: Activity },
    { id: 'analytics', label: 'Analytics & Yield', icon: BarChart3 },
    { id: 'history', label: 'Sensor History', icon: History },
    { id: 'faults', label: 'Fault History', icon: AlertTriangle },
    { id: 'devices', label: 'IoT Devices', icon: Cpu },
    { id: 'model', label: 'AI Model & DNN', icon: Layers },
    {
      id: 'alerts',
      label: 'Alerts Center',
      icon: Bell,
      count: unreadAlertCount
    },
    { id: 'system', label: 'System Health', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#0c1220]/95 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div
            onClick={() => onRouteChange('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition shrink-0">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-sm font-extrabold tracking-tight text-white leading-tight">
                  Smart SolarGuard
                </h1>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">
                  AI + IoT Platform
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          <button
            onClick={() => onRouteChange('landing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              currentRoute === 'landing'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-4 h-4 shrink-0 text-slate-400" />
            {!collapsed && <span>Home / Portal</span>}
          </button>

          <div className="my-2 border-t border-slate-800/60" />

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Model Core</span>
              <span className="text-emerald-400 font-mono">v1.0 Ready</span>
            </div>
            <div className="text-[10px] text-slate-500">
              ESP32 + Keras DNN Architecture
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
