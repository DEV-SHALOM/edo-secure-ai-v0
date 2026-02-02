'use client';

import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Incident } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';

interface AnalyticsPanelProps {
  incidents: Incident[];
  expanded?: boolean;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export default function AnalyticsPanel({ incidents, expanded }: AnalyticsPanelProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayIncidents = incidents.filter(inc => {
      const incDate = new Date(inc.timestamp);
      return isWithinInterval(incDate, { start: dayStart, end: dayEnd });
    });

    return {
      date: format(date, 'EEE'),
      incidents: dayIncidents.length,
      resolved: dayIncidents.filter(i => i.status === 'resolved').length,
    };
  });

  const incidentTypes = [
    { name: 'Crowd Detection', value: incidents.filter(i => i.type === 'crowd_detection').length },
    { name: 'Person Detection', value: incidents.filter(i => i.type === 'person_detection').length },
    { name: 'Motion Anomaly', value: incidents.filter(i => i.type === 'motion_anomaly').length },
    { name: 'Night Activity', value: incidents.filter(i => i.type === 'night_activity').length },
    { name: 'Restricted Area', value: incidents.filter(i => i.type === 'restricted_area').length },
  ].filter(t => t.value > 0);

  const severityData = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, color: '#ef4444' },
    { name: 'High', value: incidents.filter(i => i.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length, color: '#eab308' },
    { name: 'Low', value: incidents.filter(i => i.severity === 'low').length, color: '#22c55e' },
  ];

  if (!expanded) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Incident Trends
          </h3>
          <span className="text-sm text-gray-500">Last 7 days</span>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#1e3a5f" name="Incidents" />
              <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Incident Trends
            </h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="incidents" stroke="#1e3a5f" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Types</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incidentTypes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#1e3a5f">
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Summary Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-gray-900">{incidents.length}</p>
              <p className="text-sm text-gray-600">Total Incidents</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-green-600">
                {incidents.filter(i => i.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-red-600">
                {incidents.filter(i => i.severity === 'critical').length}
              </p>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(incidents.reduce((sum, i) => sum + i.confidence, 0) / Math.max(incidents.length, 1) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
