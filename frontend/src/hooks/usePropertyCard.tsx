import { useState } from 'react';
import { listingService } from '@/services/listingService';
import { clientService } from '@/services/clientService';

export const usePropertyCard = (
  id: number, 
  initialIsFavorite: boolean
) => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const addReview = async (listingId: number, rating: number, comment: string) => {
    await listingService.addReview(listingId, { rating, comment });
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const clientId = Number(localStorage.getItem('userId'));
    if (!clientId) return;
    try {
      if (isFavorite) {
        await clientService.removeFavorite(clientId, id);
        setIsFavorite(false);
      } else {
        await clientService.addFavorite(clientId, id);
        setIsFavorite(true);
      }
    } catch (error) { 
      console.error("Error favoritos:", error); 
    }
  };

  const confirmPurchase = async (onPurchaseConfirm: (id: number) => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await onPurchaseConfirm(id);
      setIsPurchaseModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetails = () => setIsDetailsModalOpen(true);

  return {
    state: { 
        isPurchaseModalOpen, 
        isDetailsModalOpen, 
        isSubmitting, 
        isFavorite
    },
    actions: { 
        setIsPurchaseModalOpen, 
        setIsDetailsModalOpen, 
        toggleFavorite, 
        addReview, 
        confirmPurchase,
        openDetails
    }
  };
};