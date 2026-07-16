import { useState } from 'react';
import type { ReviewResponse } from '@/types/review';
import { listingService } from '@/services/listingService';
import { clientService } from '@/services/clientService';

export const usePropertyCard = (
  id: number, 
  reviews: ReviewResponse[],  
  averageRating: number | null, 
  initialIsFavorite: boolean
) => {
  const [localReviews, setLocalReviews] = useState<ReviewResponse[]>(reviews);
  const [localRating, setLocalRating] = useState<number | null>(averageRating);
  
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const addReview = async (listingId: number, rating: number, comment: string) => {
    const newReview = await listingService.addReview(listingId, { rating, comment });
    const updated = [...localReviews, newReview];
    setLocalReviews(updated);
    setLocalRating(updated.reduce((sum, r) => sum + r.rating, 0) / updated.length);
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
    } catch (error) { console.error("Error favoritos:", error); }
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

  const openDetails = async () => {
    try {
      const fresh = await listingService.getById(id);
      setLocalReviews(fresh.reviews);
      setLocalRating(fresh.average_rating ?? null);
    } catch (error) { console.error("Error refrescar:", error); }
    setIsDetailsModalOpen(true);
  };

  return {
    state: { 
        isPurchaseModalOpen, 
        isDetailsModalOpen, 
        isSubmitting, 
        isFavorite, 
        localReviews, 
        localRating 
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