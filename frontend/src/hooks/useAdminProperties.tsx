import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import type { PropertySaveResponse, PropertyUpdate } from '@/types/property';

export const useAdminProperties = () => {
  const [properties, setProperties] = useState<PropertySaveResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProp, setSelectedProp] = useState<PropertySaveResponse | null>(null);

  const [editAddress, setEditAddress] = useState('');
  const [editLocation, setEditLocation] = useState('');
const [editType, setEditType] = useState<'house' | 'apartment'>('house');

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<PropertySaveResponse[]>('/admins/properties-saves'); setProperties(response.data);
    } catch {
      setError('Error al cargar propiedades.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const openEditModal = (prop: PropertySaveResponse) => {
    setSelectedProp(prop);
    setEditAddress(prop.address);
    setEditLocation(prop.location || '');
    setEditType(prop.type as 'house' | 'apartment');
    setIsEditModalOpen(true);
  };

  const onConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProp) return;
    setIsSubmitting(true);
    try {
      await apiClient.put<PropertyUpdate>(`/properties/${selectedProp.id}`, {
        address: editAddress,
        location: editLocation,
        type: editType
      });
      setIsEditModalOpen(false);
      await fetchProperties();
    } catch { setError('Error al actualizar.'); }
    finally { setIsSubmitting(false); }
  };

  const onConfirmDelete = async () => {
    if (!selectedProp) return;
    setIsSubmitting(true);
    try {
      await apiClient.delete(`/properties/${selectedProp.id}`);
      setIsDeleteModalOpen(false);
      await fetchProperties();
    } catch { setError('Error al eliminar.'); }
    finally { setIsSubmitting(false); }
  };

  return {
    properties, isLoading, error, isEditModalOpen, isDeleteModalOpen, isSubmitting,
    editAddress, setEditAddress, editLocation, setEditLocation,
    openEditModal,
    openDeleteModal: (p: PropertySaveResponse) => { setSelectedProp(p); setIsDeleteModalOpen(true); },
    closeEditModal: () => setIsEditModalOpen(false),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    onConfirmEdit, onConfirmDelete, editType, setEditType
  };
};