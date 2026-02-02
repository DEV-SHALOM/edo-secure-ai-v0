'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  color: 'red' | 'green' | 'yellow' | 'blue';
}

const colorClasses = {
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    trend: 'text-red-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    trend: 'text-green-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-100 text-yellow-600',
    trend: 'text-yellow-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    trend: 'text-blue-600',
  },
};

export default function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className={`${colors.icon} p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${colors.trend}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
      </div>
    </div>
  );
}
