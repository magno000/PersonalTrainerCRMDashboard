import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, TrendingUp, Users, DollarSign, Activity, Target, AlertTriangle } from 'lucide-react';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { calculateMetrics } from './utils/calculations';
import { MetricCard } from './components/MetricCard';
import { ClientCard } from './components/ClientCard';
import { MonthlyRevenueChart, PlanDistributionChart, WeeklyProgressChart } from './components/Charts';
import { Client } from './types/client';

function App() {
  const { clients, loading, error, refetch } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  
  const metrics = useMemo(() => calculateMetrics(clients), [clients]);
  
  // Filtered clients based on search and status
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.Cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.Email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || client.Estado === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // Generate monthly revenue data (mock data for demonstration)
  const monthlyRevenueData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return months.map((month, index) => ({
      month,
      revenue: index <= currentMonth ? 
        Math.floor(metrics.facturacionMensual * (0.7 + Math.random() * 0.6)) : 
        0
    }));
  }, [metrics.facturacionMensual]);

  // Plan distribution data
  const planDistributionData = useMemo(() => {
    return Object.entries(metrics.distribucionPlanes).map(([name, value]) => ({
      name,
      value,
      revenue: metrics.ingresosPorPlan[name] || 0
    }));
  }, [metrics.distribucionPlanes, metrics.ingresosPorPlan]);

  // Weekly progress data (mock data)
  const weeklyProgressData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map(day => ({
      day,
      sessions: Math.floor(Math.random() * 25) + 5
    }));
  }, []);

  // Upcoming renewals
  const upcomingRenewals = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return clients.filter(client => {
      if (!client.Proximo_Pago) return false;
      const paymentDate = new Date(client.Proximo_Pago);
      return paymentDate >= today && paymentDate <= nextWeek;
    });
  }, [clients]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-white text-lg">Cargando datos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Error al cargar los datos</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-lg border border-white/10 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-white text-2xl font-bold">Personal Trainer Dashboard</h1>
              </div>
              <p className="text-gray-300">Analíticas en tiempo real de tu negocio fitness</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">En vivo</span>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-1">
                <span className="text-blue-400 text-sm font-semibold">+24.5% este mes</span>
              </div>
              <button 
                onClick={refetch}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 border border-white/10 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Facturación Mensual"
            value={`€${metrics.facturacionMensual.toLocaleString()}`}
            change="+12.5%"
            icon={DollarSign}
            color="bg-blue-500"
            bgGradient="bg-gradient-to-br from-blue-500/20 to-blue-600/10"
          />
          <MetricCard
            title="Ingresos Activos"
            value={`€${metrics.ingresosActivos.toLocaleString()}`}
            change="+8.2%"
            icon={TrendingUp}
            color="bg-purple-500"
            bgGradient="bg-gradient-to-br from-purple-500/20 to-purple-600/10"
          />
          <MetricCard
            title="Clientes Activos"
            value={metrics.clientesActivos}
            change="+15.7%"
            icon={Users}
            color="bg-blue-500"
            bgGradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
          />
          <MetricCard
            title="Sesiones Completadas"
            value={metrics.sesionesCompletadas}
            change="+6.3%"
            icon={Activity}
            color="bg-green-500"
            bgGradient="bg-gradient-to-br from-green-500/20 to-emerald-500/10"
          />
          <MetricCard
            title="Progreso Promedio"
            value={`${metrics.progresoPromedio.toFixed(1)}%`}
            change="+7.8%"
            icon={Target}
            color="bg-orange-500"
            bgGradient="bg-gradient-to-br from-orange-500/20 to-red-500/10"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <MonthlyRevenueChart data={monthlyRevenueData} />
          <PlanDistributionChart data={planDistributionData} />
        </div>

        <WeeklyProgressChart data={weeklyProgressData} />

        {/* Upcoming Renewals Alert */}
        {upcomingRenewals.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-yellow-500/20 backdrop-blur-lg border border-yellow-500/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/5" />
            <div className="relative flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-yellow-400 font-semibold">Próximas Renovaciones</h3>
                <p className="text-gray-300 text-sm">
                  {upcomingRenewals.length} cliente{upcomingRenewals.length > 1 ? 's' : ''} con pagos próximos esta semana
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clients Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-lg border border-white/10 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
          <div className="relative">
            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Lista de Clientes</span>
              </h2>
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Activo">Activo</option>
                    <option value="Pausado">Pausado</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredClients.map((client, index) => (
                <ClientCard key={`${client.Cliente}-${index}`} client={client} />
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg font-semibold mb-2">No se encontraron clientes</h3>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;