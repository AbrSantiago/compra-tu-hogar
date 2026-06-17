import { useState, useEffect, useCallback } from 'react';
import { clientService } from '../services/clientService';
import { realEstateService } from '../services/realEstateService';
import type { UserMeResponse } from '../types/auth';
import type { RealEstateResponse, RealEstateCreate } from '../types/realEstate';
import { AxiosError } from 'axios';

export const useAdmin = () => {
  const [clients, setClients] = useState<UserMeResponse[]>([]);
  const [realEstates, setRealEstates] = useState<RealEstateResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setError(null);
    try {
      const [clientsData, realEstatesData] = await Promise.all([
        clientService.getAll(),    
        realEstateService.getAll()  
      ]);

      setClients(clientsData);
      setRealEstates(realEstatesData);
    } catch { 
      setError('Error al cargar la información del panel de administración.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRealEstate = async (formData: RealEstateCreate) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await realEstateService.create(formData);
      setSubmitSuccess('Inmobiliaria dada de alta de forma exitosa.');
      await fetchDashboardData();
      return true; 
    } catch (err: unknown) {
      const backendMessage = (err as AxiosError<{ detail?: string }>)?.response?.data?.detail;
      setSubmitError(backendMessage || 'Error al procesar el alta de la inmobiliaria.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

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
    clients, 
    realEstates, 
    isLoading, 
    error, 
    refetch: fetchDashboardData,
    createRealEstate,
    isSubmitting,
    submitError,
    submitSuccess
  };
};