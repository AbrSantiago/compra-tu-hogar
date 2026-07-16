import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '@/services/apiClient';
import type { ListingResponse, ListingStatus } from '@/types/listing';
import type { PropertySaveResponse } from '@/types/property';

type DashboardItem = ListingResponse | PropertySaveResponse;

export const useAdminDashboard = () => {
  const [propertiesSaves, setPropertiesSaves] = useState<PropertySaveResponse[]>([]);
  const [purchases, setPurchases] = useState<ListingResponse[]>([]);
  const [allListings, setAllListings] = useState<ListingResponse[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState<ListingStatus>('active');
  const [editAddress, setEditAddress] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [propertiesRes, purchasesRes, listingsRes] = await Promise.all([
        apiClient.get<PropertySaveResponse[]>('/admins/properties-saves'),
        apiClient.get<ListingResponse[]>('/admins/purchases'),
        apiClient.get<ListingResponse[]>('/admins/listings-reviews'),
      ]);

      setPropertiesSaves(propertiesRes.data);
      setPurchases(purchasesRes.data);
      setAllListings(listingsRes.data);
    } catch (err: unknown) {
      const errorData = (err as AxiosError<{ friendlyMessage?: string; detail?: string }>)?.response?.data;
      setError(errorData?.friendlyMessage || errorData?.detail || 'Error al cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchDashboardData();
    };
    init();
  }, [fetchDashboardData]);

  const openEditModal = (item: DashboardItem) => {
    setSelectedItem(item);
    if ('price' in item) {
      setEditPrice(item.price.toString());
      setEditStatus(item.status);
    } else {
      setEditAddress(item.address);
      setEditLocation(item.location || '');
    }
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: DashboardItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const onConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      if ('price' in selectedItem) {
        await apiClient.put(`/listings/${selectedItem.id}`, {
          price: parseFloat(editPrice),
          status: editStatus,
        });
      } else {
        await apiClient.put(`/properties/${selectedItem.id}`, {
          address: editAddress,
          location: editLocation,
        });
      }
      setIsEditModalOpen(false);
      await fetchDashboardData();
    } catch {
      setError('Error al guardar cambios.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      const url = 'price' in selectedItem ? `/listings/${selectedItem.id}` : `/properties/${selectedItem.id}`;
      await apiClient.delete(url);
      setIsDeleteModalOpen(false);
      await fetchDashboardData();
    } catch {
      setError('Error al eliminar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    propertiesSaves,
    purchases,
    allListings,
    isLoading,
    error,
    refetch: fetchDashboardData,
    isEditModalOpen,
    isDeleteModalOpen,
    isSubmitting,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    editAddress,
    setEditAddress,
    editLocation,
    setEditLocation,
    openEditModal,
    openDeleteModal,
    closeEditModal: () => setIsEditModalOpen(false),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    onConfirmEdit,
    onConfirmDelete,
  };
};