'use client';

import { useEffect, useState } from 'react';
import { Incident, Camera } from '@/types';

interface MapClientProps {
  incidents: Incident[];
  cameras: Camera[];
  compact?: boolean;
}

const EDO_CENTER: [number, number] = [6.5244, 5.8987];

export default function MapClient({ incidents, cameras, compact }: MapClientProps) {
  const [mounted, setMounted] = useState(false);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);
  const [CircleMarker, setCircleMarker] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet/dist/leaflet.css');
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
    import('react-leaflet').then((rl) => {
      setMapContainer(() => rl.MapContainer);
      setTileLayer(() => rl.TileLayer);
      setMarker(() => rl.Marker);
      setPopup(() => rl.Popup);
      setCircleMarker(() => rl.CircleMarker);
      setMounted(true);
    });
  }, []);

  if (!mounted || !MapContainer || !L) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center min-h-[300px]">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const incidentIcon = (severity: string) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); background-color: ${
      severity === 'critical' ? '#ef4444' :
      severity === 'high' ? '#f97316' :
      severity === 'medium' ? '#eab308' : '#3b82f6'
    };">
      <svg style="width: 12px; height: 12px; color: white;" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const cameraIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); background-color: #1e3a5f;">
      <svg style="width: 12px; height: 12px; color: white;" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const activeIncidents = incidents.filter(i => i.status === 'active');

  return (
    <MapContainer
      center={EDO_CENTER}
      zoom={compact ? 10 : 11}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
      style={{ minHeight: compact ? '300px' : '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cameras.map(camera => (
        <Marker
          key={camera.id}
          position={[camera.latitude, camera.longitude]}
          icon={cameraIcon}
        >
          <Popup>
            <div className="p-2">
              <h4 className="font-semibold">{camera.name}</h4>
              <p className="text-sm text-gray-600">{camera.location}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                camera.status === 'online' ? 'bg-green-100 text-green-700' :
                camera.status === 'offline' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {camera.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}

      {activeIncidents.map(incident => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={incidentIcon(incident.severity)}
        >
          <Popup>
            <div className="p-2">
              <h4 className="font-semibold text-red-600">{incident.type.replace('_', ' ').toUpperCase()}</h4>
              <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
              <p className="text-xs text-gray-500 mt-2">{incident.location}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  incident.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  incident.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {incident.severity}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(incident.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {!compact && incidents.map(incident => (
        <CircleMarker
          key={`heat-${incident.id}`}
          center={[incident.latitude, incident.longitude]}
          radius={incident.severity === 'critical' ? 20 : incident.severity === 'high' ? 15 : 10}
          pathOptions={{
            color: incident.severity === 'critical' ? '#ef4444' : 
                   incident.severity === 'high' ? '#f97316' : '#eab308',
            fillColor: incident.severity === 'critical' ? '#ef4444' : 
                       incident.severity === 'high' ? '#f97316' : '#eab308',
            fillOpacity: 0.2,
            weight: 1,
          }}
        />
      ))}
    </MapContainer>
  );
}
