import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '@/services/apiClient';
import type { ListingResponse } from '@/types/listing'; 
import type { PropertySaveResponse } from '@/types/property'; 

export const useAdminDashboard = () => {
  const [propertiesSaves, setPropertiesSaves] = useState<PropertySaveResponse[]>([]);
  const [purchases, setPurchases] = useState<ListingResponse[]>([]);
  const [allListings, setAllListings] = useState<ListingResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [propertiesRes, purchasesRes, listingsRes] = await Promise.all([
        apiClient.get<PropertySaveResponse[]>('/admins/properties-saves'),
        apiClient.get<ListingResponse[]>('/admins/purchases'),
        apiClient.get<ListingResponse[]>('/admins/listings-reviews')
      ]);

      setPropertiesSaves(propertiesRes.data);
      setPurchases(purchasesRes.data);
      setAllListings(listingsRes.data);
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'Error al cargar los datos del panel.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchDashboardData();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchDashboardData]);

  return { 
    propertiesSaves, 
    purchases, 
    allListings, 
    isLoading, 
    error, 
    refetch: fetchDashboardData 
  };
};