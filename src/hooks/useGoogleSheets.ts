import { useState, useEffect } from 'react';
import { Client } from '../types/client';

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1mHbzCrTfUS31P1yQ7fUUa9M6zdKKSv0pn75Ykw6sdxU/export?format=csv&gid=0';


export const useGoogleSheets = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(SHEETS_CSV_URL);
      
      if (!response.ok) {
        throw new Error('Error al conectar con Google Sheets');
      }

      const csvText = await response.text();
      const rows = csvText.split('\n').filter(row => row.trim());
      
      if (rows.length < 2) {
        throw new Error('No se encontraron datos en la hoja de cálculo');
      }

      const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const clientsData: Client[] = [];

      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length >= headers.length && values[0]) {
          const client: any = {};
          
          headers.forEach((header, index) => {
            let value: any = values[index] || '';
            
            // Convert numeric fields
            if (['Precio', 'Peso_Inicial', 'Peso_Actual', 'Objetivo_Peso', 'Sesiones_Completadas', 'Sesiones_Totales'].includes(header)) {
              value = parseFloat(value) || 0;
            }
            
            client[header] = value;
          });

          clientsData.push(client as Client);
        }
      }

      setClients(clientsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Actualizar datos cada 30 segundos
    const interval = setInterval(fetchData, 3000000);
    
    return () => clearInterval(interval);
  }, []);

  return { clients, loading, error, refetch: fetchData };
};