'use client';

import dynamic from 'next/dynamic';
import { Incident, Camera } from '@/types';

interface MapViewProps {
  incidents: Incident[];
  cameras: Camera[];
  compact?: boolean;
}

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center min-h-[300px]">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function MapView({ incidents, cameras, compact }: MapViewProps) {
  return <MapClient incidents={incidents} cameras={cameras} compact={compact} />;
}
