import { Client, DashboardMetrics } from '../types/client';

export const calculateMetrics = (clients: Client[]): DashboardMetrics => {
  const facturacionMensual = clients.reduce((sum, client) => sum + (client.Precio || 0), 0);
  
  const clientesActivos = clients.filter(client => client.Estado === 'Activo');
  const ingresosActivos = clientesActivos.reduce((sum, client) => sum + (client.Precio || 0), 0);
  
  const sesionesCompletadas = clients.reduce((sum, client) => sum + (client.Sesiones_Completadas || 0), 0);
  
  // Calcular progreso promedio de peso
  let totalProgreso = 0;
  let clientesConProgreso = 0;
  
  clients.forEach(client => {
    if (client.Peso_Inicial && client.Peso_Actual && client.Objetivo_Peso) {
      const pesoInicial = client.Peso_Inicial;
      const pesoActual = client.Peso_Actual;
      const pesoObjetivo = client.Objetivo_Peso;
      
      const totalAPerder = Math.abs(pesoInicial - pesoObjetivo);
      const perdidoHastaAhora = Math.abs(pesoInicial - pesoActual);
      
      if (totalAPerder > 0) {
        const progreso = Math.min((perdidoHastaAhora / totalAPerder) * 100, 100);
        totalProgreso += progreso;
        clientesConProgreso++;
      }
    }
  });
  
  const progresoPromedio = clientesConProgreso > 0 ? totalProgreso / clientesConProgreso : 0;
  
  // Distribución por planes
  const distribucionPlanes = clients.reduce((acc, client) => {
    const plan = client.Plan || 'Sin Plan';
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  // Ingresos por plan
  const ingresosPorPlan = clients.reduce((acc, client) => {
    const plan = client.Plan || 'Sin Plan';
    acc[plan] = (acc[plan] || 0) + (client.Precio || 0);
    return acc;
  }, {} as { [key: string]: number });

  return {
    facturacionMensual,
    ingresosActivos,
    clientesActivos: clientesActivos.length,
    sesionesCompletadas,
    progresoPromedio,
    distribucionPlanes,
    ingresosPorPlan
  };
};

export const getClientProgress = (client: Client): number => {
  if (!client.Peso_Inicial || !client.Peso_Actual || !client.Objetivo_Peso) return 0;
  
  const pesoInicial = client.Peso_Inicial;
  const pesoActual = client.Peso_Actual;
  const pesoObjetivo = client.Objetivo_Peso;
  
  const totalAPerder = Math.abs(pesoInicial - pesoObjetivo);
  const perdidoHastaAhora = Math.abs(pesoInicial - pesoActual);
  
  if (totalAPerder === 0) return 100;
  
  return Math.min((perdidoHastaAhora / totalAPerder) * 100, 100);
};

export const getSessionProgress = (client: Client): number => {
  if (!client.Sesiones_Totales || client.Sesiones_Totales === 0) return 0;
  return Math.min((client.Sesiones_Completadas / client.Sesiones_Totales) * 100, 100);
};