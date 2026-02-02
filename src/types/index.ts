export interface Incident {
  id: string;
  type: 'crowd_detection' | 'person_detection' | 'motion_anomaly' | 'night_activity' | 'restricted_area';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  description: string;
  confidence: number;
  cameraId: string;
  status: 'active' | 'acknowledged' | 'resolved';
  videoClipUrl?: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'maintenance';
  type: 'cctv' | 'drone' | 'mobile';
  streamUrl: string;
}

export interface Alert {
  id: string;
  incidentId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged: boolean;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator' | 'viewer';
  name: string;
}

export interface AnalyticsData {
  date: string;
  incidents: number;
  resolved: number;
}
