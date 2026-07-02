import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import type { RealEstateResponse, RealEstateCreate } from '@/types/realEstate';
import { AxiosError } from 'axios';

export const useAdminRealEstate = () => {
  const [realEstates, setRealEstates] = useState<RealEstateResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const fetchRealEstates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RealEstateResponse[]>('/real-estates');
      setRealEstates(response.data);
    } catch (err: unknown) {
      const backendMessage = (err as AxiosError<{ detail?: string }>)?.response?.data?.detail;
      setError(backendMessage || 'No se pudieron cargar las inmobiliarias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRealEstate = async (data: RealEstateCreate) => {
    try {
      const response = await apiClient.post<RealEstateResponse>('/real-estates', data);
      setRealEstates((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: unknown) {
      const backendMessage = (err as AxiosError<{ detail?: string }>)?.response?.data?.detail;
      throw new Error(backendMessage || 'No se pudo crear la inmobiliaria.', { cause: err });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!name || !email || !password) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await createRealEstate({ name, email, password });
      setFormSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error desconocido.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchRealEstates();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchRealEstates]);

  return { 
    realEstates, 
    isLoading, 
    error, 
    createRealEstate, 
    refetch: fetchRealEstates, 
    handleSubmit, 
    formError, 
    formSuccess, 
    name, setName, 
    email, setEmail, 
    password, setPassword 
  };
};