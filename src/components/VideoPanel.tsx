'use client';

import { useState } from 'react';
import { Camera, Maximize2, Volume2, VolumeX, Circle } from 'lucide-react';
import { Camera as CameraType } from '@/types';

interface VideoPanelProps {
  cameras: CameraType[];
  expanded?: boolean;
}

export default function VideoPanel({ cameras, expanded }: VideoPanelProps) {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    maintenance: 'bg-yellow-500',
  };

  const gridClass = expanded 
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
    : 'grid-cols-2';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Live Camera Feeds
        </h3>
        <span className="text-sm text-gray-500">{cameras.length} cameras</span>
      </div>

      <div className={`grid ${gridClass} gap-4`}>
        {cameras.map(camera => (
          <div
            key={camera.id}
            className={`relative rounded-lg overflow-hidden bg-gray-900 aspect-video cursor-pointer group ${
              selectedCamera === camera.id ? 'ring-2 ring-government-medium' : ''
            }`}
            onClick={() => setSelectedCamera(camera.id)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/50">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Simulated Feed</p>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColors[camera.status]} animate-pulse`} />
              <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                {camera.status.toUpperCase()}
              </span>
            </div>
            
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Circle className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-white text-xs">REC</span>
            </div>
            
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white font-medium text-sm truncate">{camera.name}</p>
              <p className="text-white/70 text-xs truncate">{camera.location}</p>
            </div>
            
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cameras.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No cameras configured</p>
        </div>
      )}
    </div>
  );
}
