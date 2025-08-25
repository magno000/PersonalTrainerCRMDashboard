import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  bgGradient
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${bgGradient} backdrop-blur-lg border border-white/10 p-6 group hover:scale-[1.02] transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-20 border border-white/20`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          {change && (
            <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} backdrop-blur-sm border border-white/10`}>
              {change}
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
          <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
};