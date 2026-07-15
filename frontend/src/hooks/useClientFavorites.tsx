import { useState, useEffect, useCallback } from 'react';
import { clientService } from '@/services/clientService';
import { extractErrorMessage } from '@/utils/errors';
import type { ListingResponse } from '@/types/listing';
import { getPropertyImage } from '@/utils/imageMapper';

export type FavoriteWithImage = ListingResponse & { image: string };

export const useClientFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteWithImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clientId = Number(localStorage.getItem('userId'));
      if (!clientId) throw new Error("No hay usuario autenticado");
      
      const data = await clientService.getFavorites(clientId);
      
      const favoritesWithImages: FavoriteWithImage[] = data.map(item => ({
        ...item,
        image: getPropertyImage(item.id)
      }));
      
      setFavorites(favoritesWithImages);
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudieron cargar tus favoritos.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    refetch: fetchFavorites,
  };
};