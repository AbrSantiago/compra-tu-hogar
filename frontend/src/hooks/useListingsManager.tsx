import { useState } from 'react';
import { useRealEstate } from './useRealEstate';
import type { ListingResponse, ListingStatus } from '@/types/listing';

export const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  reserved: 'Reservado',
  sold: 'Vendido',
  paused: 'Pausado',
};

export const useListingsManager = () => {
  const realEstate = useRealEstate();
  const { handleUpdateListing, handleDeleteListing } = realEstate;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingResponse | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStatus, setEditStatus] = useState<ListingStatus>('active');

  const openEditModal = (list: ListingResponse) => {
    setSelectedListing(list);
    setEditPrice(list.price.toString());
    setEditStatus(list.status);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (list: ListingResponse) => {
    setSelectedListing(list);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const onConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedListing) {
      await handleUpdateListing(selectedListing.id, {
        price: Number(editPrice),
        status: editStatus,
      });
      closeEditModal();
    }
  };

  const onConfirmDelete = async () => {
    if (selectedListing) {
      await handleDeleteListing(selectedListing.id);
      closeDeleteModal();
    }
  };

  return {
    ...realEstate,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedListing,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
    onConfirmEdit,
    onConfirmDelete,
  };
};