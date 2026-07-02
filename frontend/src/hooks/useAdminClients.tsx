import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '@/services/apiClient';
import type { ClientResponse } from '@/types/client';

export const useAdminClients = () => {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ClientResponse[]>('/clients');
      setClients(response.data);
    } catch (err: unknown) {
      const backendMessage = (err as AxiosError<{ detail?: string }>)?.response?.data?.detail;
      setError(backendMessage || 'No se pudieron cargar los clientes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchClients();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchClients]);

  return { clients, isLoading, error, refetch: fetchClients };
};