import { useState, useEffect, useCallback } from "react";
import { realEstateService } from "@/services/realEstateService";
import { extractErrorMessage } from "@/utils/errors";
import type { ClientResponse } from "@/types/client";

export const useRealEstateClients = (realEstateId: string | undefined) => {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!realEstateId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await realEstateService.getClients(Number(realEstateId));
      setClients(data);
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudieron cargar los clientes."));
    } finally {
      setIsLoading(false);
    }
  }, [realEstateId]);

  useEffect(() => {
    const loadClients = async () => {
      await fetchClients();
    };

    loadClients();
  }, [fetchClients]);

  return { clients, isLoading, error, refetch: fetchClients };
};
