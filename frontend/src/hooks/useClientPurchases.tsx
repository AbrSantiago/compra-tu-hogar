import { useState, useEffect, useCallback } from 'react';
import { clientService } from '@/services/clientService';
import { extractErrorMessage } from '@/utils/errors';
import type { ListingResponse } from '@/types/listing';
import { getPropertyImage } from '@/utils/imageMapper';

export type PurchaseWithImage = ListingResponse & { image: string };

export const useClientPurchases = () => {
  const [purchases, setPurchases] = useState<PurchaseWithImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clientId = Number(localStorage.getItem('userId'));
      if (!clientId) throw new Error("No hay usuario autenticado");
      
      const data = await clientService.getPurchases(clientId);
      
      const purchasesWithImages: PurchaseWithImage[] = data.map(item => ({
        ...item,
        image: getPropertyImage(item.id)
      }));
      
      setPurchases(purchasesWithImages);
    } catch (err) {
      console.error("Error al buscar las compras:", err);
      setError(extractErrorMessage(err, 'No se pudieron cargar tus propiedades compradas.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return {
    purchases,
    isLoading,
    error,
    refetch: fetchPurchases,
  };
};