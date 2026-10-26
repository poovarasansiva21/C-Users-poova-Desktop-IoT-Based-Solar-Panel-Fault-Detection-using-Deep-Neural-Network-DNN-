import React, { useState, useEffect, useCallback } from 'react';
import { SensorReading, AlertItem } from './types';
import { api } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LiveSensors } from './pages/LiveSensors';
import { AiDetection } from './pages/AiDetection';
import { Analytics } from './pages/Analytics';
import { SensorHistory } from './pages/SensorHistory';
import { FaultHistory } from './pages/FaultHistory';
import { IotDevices } from './pages/IotDevices';
import { AiModel } from './pages/AiModel';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { SystemHealth } from './pages/SystemHealth';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [refreshInterval, setRefreshInterval] = useState<number>(3000);

  // Live state
  const [latestSensor, setLatestSensor] = useState<SensorReading | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [unreadAlertCount, setUnreadAlertCount] = useState<number>(0);

  // Sync theme to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Polling data fetcher
  const fetchTelemetry = useCallback(async () => {
    try {
      const [sensorRes, healthRes] = await Promise.allSettled([
        api.getLatestSensor(),
        api.getHealth()
      ]);

      if (sensorRes.status === 'fulfilled') {
        setLatestSensor(sensorRes.value);
        setIsOnline(true);
        setLastUpdated(new Date().toLocaleTimeString());
        if (sensorRes.value.simulation_mode !== undefined) {
          setIsSimulating(sensorRes.value.simulation_mode);
        }
      } else {
        setIsOnline(false);
      }

      if (healthRes.status === 'fulfilled') {
        setSystemHealth(healthRes.value);
      } else {
        setSystemHealth((prev: any) => (prev ? { ...prev, backend_status: 'OFFLINE' } : null));
      }
    } catch (e) {
      setIsOnline(false);
    }
  }, []);

  const fetchAlertCount = useCallback(async () => {
    try {
      const alerts = await api.getAlerts('ACTIVE');
      setUnreadAlertCount(alerts.length);
    } catch (e) {
      // Backend offline
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    fetchAlertCount();
    const timer = setInterval(() => {
      fetchTelemetry();
      fetchAlertCount();
    }, refreshInterval);
    return () => clearInterval(timer);
  }, [fetchTelemetry, fetchAlertCount, refreshInterval]);

  const handleToggleSimulation = async () => {
    try {
      if (isSimulating) {
        await api.stopSimulation();
        setIsSimulating(false);
      } else {
        await api.startSimulation();
        setIsSimulating(true);
      }
      fetchTelemetry();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  // If on Landing Page, render standalone view
  if (currentRoute === 'landing') {
    return (
      <div className={theme}>
        <LandingPage onNavigate={(route) => setCurrentRoute(route)} />
      </div>
    );
  }

  // App Layout for Dashboard & Operations
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b101b] text-slate-100' : 'bg-slate-50 text-slate-900'} flex`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentRoute={currentRoute}
          onRouteChange={(r) => setCurrentRoute(r)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          unreadAlertCount={unreadAlertCount}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex">
          <div className="w-64 bg-[#0c1220] h-full shadow-2xl">
            <Sidebar
              currentRoute={currentRoute}
              onRouteChange={(r) => {
                setCurrentRoute(r);
                setMobileMenuOpen(false);
              }}
              collapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
              unreadAlertCount={unreadAlertCount}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Topbar
          isOnline={isOnline}
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          lastUpdated={lastUpdated}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          systemHealth={systemHealth}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {currentRoute === 'dashboard' && (
            <Dashboard
              onNavigate={(r) => setCurrentRoute(r)}
              latestSensor={latestSensor}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              onRefresh={fetchTelemetry}
            />
          )}

          {currentRoute === 'live-sensors' && (
            <LiveSensors
              latestSensor={latestSensor}
              onRefresh={fetchTelemetry}
            />
          )}

          {currentRoute === 'ai-detection' && (
            <AiDetection
              latestSensor={latestSensor}
              onRefresh={fetchTelemetry}
            />
          )}

          {currentRoute === 'analytics' && (
            <Analytics latestSensor={latestSensor} />
          )}

          {currentRoute === 'history' && <SensorHistory />}

          {currentRoute === 'faults' && <FaultHistory />}

          {currentRoute === 'devices' && (
            <IotDevices onRefreshTelemetry={fetchTelemetry} />
          )}

          {currentRoute === 'model' && <AiModel />}

          {currentRoute === 'alerts' && <Alerts />}

          {currentRoute === 'system' && <SystemHealth />}

          {currentRoute === 'settings' && (
            <Settings
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              refreshInterval={refreshInterval}
              onIntervalChange={(rate) => setRefreshInterval(rate)}
              isOnline={isOnline}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
