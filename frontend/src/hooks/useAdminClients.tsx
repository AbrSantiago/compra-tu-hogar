import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '@/services/apiClient';
import type { ClientResponse } from '@/types/client';

export const useAdminClients = () => {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);

  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ClientResponse[]>('/clients');
      setClients(response.data);
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'No se pudieron cargar los clientes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchClients();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchClients]);

  const openEditModal = (client: ClientResponse) => {
    setSelectedClient(client);
    setEditName(client.name);
    setEditSurname(client.surname);
    setEditEmail(client.email);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (client: ClientResponse) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClient(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedClient(null);
  };

  const onConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.put(`/clients/${selectedClient.id}`, {
        name: editName,
        surname: editSurname,
        email: editEmail,
      });
      closeEditModal();
      await fetchClients();
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'Error al actualizar el cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!selectedClient) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.delete(`/clients/${selectedClient.id}`);
      closeDeleteModal();
      await fetchClients();
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string, detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'Error al eliminar el cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    clients, 
    isLoading, 
    error, 
    refetch: fetchClients,
    isEditModalOpen,
    isDeleteModalOpen,
    isSubmitting,
    editName,
    setEditName,
    editSurname,
    setEditSurname,
    editEmail,
    setEditEmail,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
    onConfirmEdit,
    onConfirmDelete
  };
};