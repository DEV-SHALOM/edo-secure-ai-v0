'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, MapPin, Camera, Bell, BarChart3, 
  LogOut, Menu, X, AlertTriangle, Users, Activity
} from 'lucide-react';
import VideoPanel from './VideoPanel';
import AlertPanel from './AlertPanel';
import MapView from './MapView';
import AnalyticsPanel from './AnalyticsPanel';
import StatsCard from './StatsCard';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Incident, Alert, Camera as CameraType } from '@/types';

interface DashboardProps {
  onLogout: () => void;
}

type ViewType = 'overview' | 'map' | 'cameras' | 'alerts' | 'analytics';

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cameras, setCameras] = useState<CameraType[]>([]);
  
  const { lastMessage, isConnected } = useWebSocket('/ws/alerts');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'new_incident') {
        setIncidents(prev => [lastMessage.data, ...prev]);
        setAlerts(prev => [{
          id: `alert-${Date.now()}`,
          incidentId: lastMessage.data.id,
          message: lastMessage.data.description,
          severity: lastMessage.data.severity,
          timestamp: lastMessage.data.timestamp,
          acknowledged: false,
        }, ...prev]);
      }
    }
  }, [lastMessage]);

  const fetchInitialData = async () => {
    try {
      const [incidentsRes, camerasRes] = await Promise.all([
        fetch('/api/incidents'),
        fetch('/api/cameras'),
      ]);
      
      if (incidentsRes.ok) {
        const incidentsData = await incidentsRes.json();
        setIncidents(incidentsData);
        setAlerts(incidentsData.filter((i: Incident) => i.status === 'active').map((i: Incident) => ({
          id: `alert-${i.id}`,
          incidentId: i.id,
          message: i.description,
          severity: i.severity,
          timestamp: i.timestamp,
          acknowledged: false,
        })));
      }
      
      if (camerasRes.ok) {
        setCameras(await camerasRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const handleAcknowledge = async (incidentId: string) => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'acknowledged' }),
      });
      if (response.ok) {
        setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'acknowledged' } : i));
        setAlerts(prev => prev.map(a => a.incidentId === incidentId ? { ...a, acknowledged: true } : a));
      }
    } catch (error) {
      console.error('Failed to acknowledge incident:', error);
    }
  };

  const handleResolve = async (incidentId: string) => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });
      if (response.ok) {
        setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'resolved' } : i));
        setAlerts(prev => prev.filter(a => a.incidentId !== incidentId));
      }
    } catch (error) {
      console.error('Failed to resolve incident:', error);
    }
  };

  const activeIncidents = incidents.filter(i => i.status === 'active');
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;
  const onlineCameras = cameras.filter(c => c.status === 'online').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'map', label: 'Map View', icon: MapPin },
    { id: 'cameras', label: 'Cameras', icon: Camera },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-government-dark text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <Shield className="w-8 h-8 flex-shrink-0" />
          {sidebarOpen && <span className="font-bold text-lg">EdoSecure AI</span>}
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {navItems.find(n => n.id === currentView)?.label}
              </h1>
              <p className="text-sm text-gray-500">Edo State Security Command Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                {criticalCount} Critical
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {currentView === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Active Incidents"
                  value={activeIncidents.length}
                  icon={AlertTriangle}
                  trend={activeIncidents.length > 5 ? 'up' : 'down'}
                  color="red"
                />
                <StatsCard
                  title="Online Cameras"
                  value={`${onlineCameras}/${cameras.length}`}
                  icon={Camera}
                  color="green"
                />
                <StatsCard
                  title="Crowd Alerts"
                  value={incidents.filter(i => i.type === 'crowd_detection').length}
                  icon={Users}
                  color="yellow"
                />
                <StatsCard
                  title="System Health"
                  value="98%"
                  icon={Activity}
                  color="blue"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <VideoPanel cameras={cameras.slice(0, 4)} />
                </div>
                <div>
                  <AlertPanel 
                    alerts={alerts.slice(0, 10)} 
                    onAcknowledge={handleAcknowledge}
                    onResolve={handleResolve}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 h-[400px]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Map</h3>
                  <MapView incidents={incidents} cameras={cameras} compact />
                </div>
                <AnalyticsPanel incidents={incidents} />
              </div>
            </div>
          )}

          {currentView === 'map' && (
            <div className="bg-white rounded-xl shadow-sm p-6 h-[calc(100vh-200px)]">
              <MapView incidents={incidents} cameras={cameras} />
            </div>
          )}

          {currentView === 'cameras' && (
            <VideoPanel cameras={cameras} expanded />
          )}

          {currentView === 'alerts' && (
            <AlertPanel 
              alerts={alerts} 
              expanded 
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsPanel incidents={incidents} expanded />
          )}
        </main>
      </div>
    </div>
  );
}
