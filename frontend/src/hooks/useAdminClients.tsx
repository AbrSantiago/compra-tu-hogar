import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import type { ClientResponse } from '@/types/client';

export const useAdminClients = () => {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ClientResponse[]>('/clients');
      setClients(response.data);
    } catch (err: any) {
      const backendMessage = err.response?.data?.detail;
      setError(backendMessage || 'No se pudieron cargar los clientes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, isLoading, error, refetch: fetchClients };
};