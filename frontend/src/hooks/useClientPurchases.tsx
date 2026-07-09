import { useState, useEffect, useCallback } from 'react';
import { clientService } from '@/services/clientService';
import { extractErrorMessage } from '@/utils/errors';
import type { ListingResponse } from '@/types/listing';

export const useClientPurchases = () => {
  const [purchases, setPurchases] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clientId = Number(localStorage.getItem('userId')) || 1;
      const data = await clientService.getPurchases(clientId);
      setPurchases(data);
    } catch (err) {
      console.error("Error al buscar las compras:", err);
      setError(extractErrorMessage(err, 'No se pudieron cargar tus propiedades compradas.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchPurchases();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchPurchases]);

  return {
    purchases,
    isLoading,
    error,
    refetch: fetchPurchases,
  };
};