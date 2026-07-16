import { useState, useEffect } from 'react';
import { statsService } from '@/services/statsService';
import { extractErrorMessage } from '@/utils/errors';
import type { TopClientResponse, TopPropertyResponse, TopRealEstateResponse } from '@/types/stats';

export const useAdminStats = () => {
  const [topClients, setTopClients] = useState<TopClientResponse[]>([]);
  const [topProperties, setTopProperties] = useState<TopPropertyResponse[]>([]);
  const [topRealEstates, setTopRealEstates] = useState<TopRealEstateResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [clientsData, propertiesData, realEstatesData] = await Promise.all([
          statsService.getTopClients(),
          statsService.getTopProperties(),
          statsService.getTopRealEstates(),
        ]);

        if (isMounted) {
          setTopClients(clientsData);
          setTopProperties(propertiesData);
          setTopRealEstates(realEstatesData);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(extractErrorMessage(err, 'Error al cargar las estadísticas.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { topClients, topProperties, topRealEstates, isLoading, error };
};