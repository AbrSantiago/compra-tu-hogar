import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import type { RealEstateResponse } from '@/types/realEstate';
import type { RealEstateCreate } from '@/types/realEstate';

export const useAdminRealEstate = () => {
  const [realEstates, setRealEstates] = useState<RealEstateResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const fetchRealEstates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RealEstateResponse[]>('/real-estates');
      setRealEstates(response.data);
    } catch (err: any) {
      const backendMessage = err.response?.data?.detail;
      setError(backendMessage || 'No se pudieron cargar las inmobiliarias.');
    } finally {
      setIsLoading(false);
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
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const createRealEstate = async (data: RealEstateCreate) => {
    try {
      const response = await apiClient.post<RealEstateResponse>('/real-estates', data);
      setRealEstates((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const backendMessage = err.response?.data?.detail;
      throw new Error(backendMessage || 'No se pudo crear la inmobiliaria.');
    }
  };

  useEffect(() => {
    fetchRealEstates();
  }, []);

  return { realEstates, isLoading, error, createRealEstate, refetch: fetchRealEstates, handleSubmit, formError, formSuccess, name, setName, email, setEmail, password, setPassword };
};