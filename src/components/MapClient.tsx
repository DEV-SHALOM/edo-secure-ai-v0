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

  const incidentIcon = (severity: string) =>
    L.divIcon({
      className: 'custom-marker',
      html: `<div style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); background-color: ${
        severity === 'critical'
          ? '#ef4444'
          : severity === 'high'
          ? '#f97316'
          : severity === 'medium'
          ? '#eab308'
          : '#3b82f6'
      };"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

  const cameraIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: 24px; height: 24px; border-radius: 50%; background-color: #1e3a5f;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const activeIncidents = incidents.filter((i) => i.status === 'active');

  return (
    <MapContainer
      center={EDO_CENTER}
      zoom={compact ? 10 : 11}
      className="h-full w-full rounded-lg"
      scrollWheelZoom
      style={{ minHeight: compact ? '300px' : '400px' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cameras.map((camera) => (
        <Marker key={camera.id} position={[camera.latitude, camera.longitude]} icon={cameraIcon}>
          <Popup>{camera.name}</Popup>
        </Marker>
      ))}

      {activeIncidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={incidentIcon(incident.severity)}
        >
          <Popup>{incident.description}</Popup>
        </Marker>
      ))}

      {!compact &&
        incidents.map((incident) => (
          <CircleMarker
            key={`heat-${incident.id}`}
            center={[incident.latitude, incident.longitude]}
            radius={incident.severity === 'critical' ? 20 : incident.severity === 'high' ? 15 : 10}
            pathOptions={{ fillOpacity: 0.2 }}
          />
        ))}
    </MapContainer>
  );
}
