import { useState, useEffect, useCallback } from 'react';
import { clientService } from '@/services/clientService';
import { extractErrorMessage } from '@/utils/errors';
import type { ListingResponse } from '@/types/listing';

export const useClientFavorites = () => {
  const [favorites, setFavorites] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clientId = Number(localStorage.getItem('userId')) || 1;
      const data = await clientService.getFavorites(clientId);
      setFavorites(data);
    } catch (err) {
      console.error("Error al buscar los favoritos:", err);
      setError(extractErrorMessage(err, 'No se pudieron cargar tus favoritos.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchFavorites();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    refetch: fetchFavorites,
  };
};