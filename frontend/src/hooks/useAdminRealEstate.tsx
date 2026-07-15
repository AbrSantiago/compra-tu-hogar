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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstateResponse | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const fetchRealEstates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RealEstateResponse[]>('/real-estates');
      setRealEstates(response.data);
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'No se pudieron cargar las inmobiliarias.');
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
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      throw new Error(errorData?.friendlyMessage || errorData?.detail || 'No se pudo crear la inmobiliaria.', { cause: err });
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

  const openEditModal = (re: RealEstateResponse) => {
    setSelectedRealEstate(re);
    setEditName(re.name);
    setEditEmail(re.email);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (re: RealEstateResponse) => {
    setSelectedRealEstate(re);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRealEstate(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRealEstate(null);
  };

  const onConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRealEstate) return;

    setIsActionSubmitting(true);
    setError(null);
    try {
      await apiClient.put(`/real-estates/${selectedRealEstate.id}`, {
        name: editName,
        email: editEmail,
      });
      closeEditModal();
      await fetchRealEstates();
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'Error al actualizar la inmobiliaria.');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!selectedRealEstate) return;

    setIsActionSubmitting(true);
    setError(null);
    try {
      await apiClient.delete(`/real-estates/${selectedRealEstate.id}`);
      closeDeleteModal();
      await fetchRealEstates();
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'Error al eliminar la inmobiliaria.');
    } finally {
      setIsActionSubmitting(false);
    }
  };

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
    password, setPassword,
    isEditModalOpen, isDeleteModalOpen, isActionSubmitting,
    editName, setEditName, editEmail, setEditEmail,
    openEditModal, openDeleteModal, closeEditModal, closeDeleteModal,
    onConfirmEdit, onConfirmDelete
  };
};