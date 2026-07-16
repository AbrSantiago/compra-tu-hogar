import { useState, useEffect, useCallback } from "react";
import { realEstateService } from "@/services/realEstateService";
import { extractErrorMessage } from "@/utils/errors";
import type { ListingResponse } from "@/types/listing";

export const useRealEstateSales = (realEstateId: string | undefined) => {
  const [sales, setSales] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    if (!realEstateId) {
      setSales([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await realEstateService.getSales(Number(realEstateId));
      setSales(data);
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudieron cargar las ventas."));
    } finally {
      setIsLoading(false);
    }
  }, [realEstateId]);

  useEffect(() => {
    const loadSales = async () => {
      await fetchSales();
    };

    loadSales();
  }, [fetchSales]);

  return { sales, isLoading, error, refetch: fetchSales };
};
