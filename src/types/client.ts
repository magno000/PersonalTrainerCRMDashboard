export interface Client {
  Cliente: string;
  Email: string;
  Telefono: string;
  Plan: 'Basico' | 'Premium' | 'VIP';
  Precio: number;
  Estado: 'Activo' | 'Pausado' | 'Vencido';
  Peso_Inicial: number;
  Peso_Actual: number;
  Objetivo_Peso: number;
  Sesiones_Completadas: number;
  Sesiones_Totales: number;
  Proximo_Pago: string;
  Notas?: string;
}

export interface DashboardMetrics {
  facturacionMensual: number;
  ingresosActivos: number;
  clientesActivos: number;
  sesionesCompletadas: number;
  progresoPromedio: number;
  distribucionPlanes: { [key: string]: number };
  ingresosPorPlan: { [key: string]: number };
}