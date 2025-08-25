import React from 'react';
import { User, Mail, Phone, Calendar, TrendingUp, Activity } from 'lucide-react';
import { Client } from '../types/client';
import { getClientProgress, getSessionProgress } from '../utils/calculations';

interface ClientCardProps {
  client: Client;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const weightProgress = getClientProgress(client);
  const sessionProgress = getSessionProgress(client);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pausado': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Vencido': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'VIP': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Premium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Basico': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-lg border border-white/10 p-6 hover:scale-[1.01] transition-all duration-300 group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">{client.Cliente}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPlanColor(client.Plan)}`}>
                  {client.Plan} - €{client.Precio}
                </span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.Estado)}`}>
            {client.Estado}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <Mail className="w-4 h-4" />
            <span>{client.Email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <Phone className="w-4 h-4" />
            <span>{client.Telefono}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Próximo pago: {formatDate(client.Proximo_Pago)}</span>
          </div>
        </div>

        {/* Weight Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Progreso de Peso</span>
            </div>
            <span className="text-sm font-semibold text-green-400">{weightProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(weightProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{client.Peso_Inicial}kg → {client.Peso_Actual}kg</span>
            <span>Objetivo: {client.Objetivo_Peso}kg</span>
          </div>
        </div>

        {/* Session Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Sesiones</span>
            </div>
            <span className="text-sm font-semibold text-purple-400">{sessionProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(sessionProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{client.Sesiones_Completadas}/{client.Sesiones_Totales}</span>
          </div>
        </div>

        {/* Notes */}
        {client.Notas && (
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
            <p className="text-sm text-gray-300">{client.Notas}</p>
          </div>
        )}
      </div>
    </div>
  );
};