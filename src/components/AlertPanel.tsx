'use client';

import { Bell, AlertTriangle, Check, Clock } from 'lucide-react';
import { Alert } from '@/types';
import { format } from 'date-fns';

interface AlertPanelProps {
  alerts: Alert[];
  expanded?: boolean;
}

export default function AlertPanel({ alerts, expanded }: AlertPanelProps) {
  const severityStyles = {
    low: 'border-l-blue-400 bg-blue-50',
    medium: 'border-l-yellow-400 bg-yellow-50',
    high: 'border-l-orange-400 bg-orange-50',
    critical: 'border-l-red-400 bg-red-50 animate-pulse',
  };

  const severityBadge = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm:ss');
    } catch {
      return timestamp;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${expanded ? 'min-h-[600px]' : 'h-full'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Active Alerts
        </h3>
        <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded-full">
          {alerts.filter(a => !a.acknowledged).length} new
        </span>
      </div>

      <div className={`space-y-3 ${expanded ? '' : 'max-h-[400px]'} overflow-auto scrollbar-thin`}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`border-l-4 ${severityStyles[alert.severity]} p-4 rounded-r-lg`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${severityBadge[alert.severity]}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              {!alert.acknowledged && (
                <button className="p-1.5 hover:bg-white rounded-lg transition-colors">
                  <Check className="w-4 h-4 text-gray-400 hover:text-green-500" />
                </button>
              )}
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
