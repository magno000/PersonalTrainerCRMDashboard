import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface MonthlyRevenueChartProps {
  data: Array<{ month: string; revenue: number; }>;
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ data }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-lg border border-white/10 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-semibold">Facturación Mensual Total</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-300 text-sm">Ingresos (€)</span>
          </div>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: number) => [`€${value}`, 'Facturación']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#60A5FA' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

interface PlanDistributionChartProps {
  data: Array<{ name: string; value: number; revenue: number; }>;
}

export const PlanDistributionChart: React.FC<PlanDistributionChartProps> = ({ data }) => {
  const COLORS = {
    'VIP': '#8B5CF6',
    'Premium': '#3B82F6', 
    'Basico': '#6B7280'
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-lg border border-white/10 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
      <div className="relative">
        <h3 className="text-white text-xl font-semibold mb-6">Distribución por Planes</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#6B7280'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} clientes`,
                  `${name} - €${props.payload.revenue}`
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] || '#6B7280' }}
              />
              <span className="text-gray-300 text-sm">
                {entry.name} ({entry.value}) - €{entry.revenue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface WeeklyProgressChartProps {
  data: Array<{ day: string; sessions: number; }>;
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ data }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-lg border border-white/10 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
      <div className="relative">
        <h3 className="text-white text-xl font-semibold mb-6">Progreso Semanal</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: number) => [`${value} sesiones`, 'Completadas']}
              />
              <Bar 
                dataKey="sessions" 
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};