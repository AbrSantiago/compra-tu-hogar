import React, { useState, useEffect } from 'react';
import { PurchaseListingModal } from '../modals/PurchaseListingModal';
import { PropertyDetailsModal } from '../modals/PropertyDetailsModal';
import { clientService } from '@/services/clientService';
import type { ReviewResponse } from '@/types/review';
import { listingService } from '@/services/listingService';

interface PropertyCardProps {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  type: "house" | "apartment";
  realEstateName: string;
  characteristics: string | null;
  userRole?: string | null;
  onPurchaseConfirm: (id: number) => Promise<void>;
  initialIsFavorite?: boolean;
  averageRating?: number | null;
  reviews?: ReviewResponse[];
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  image,
  type,
  realEstateName,
  characteristics,
  userRole,
  onPurchaseConfirm,
  initialIsFavorite = false,
  averageRating = null,
  reviews = [],
}) => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [prevInitialIsFavorite, setPrevInitialIsFavorite] = useState(initialIsFavorite);

  const [localReviews, setLocalReviews] = useState<ReviewResponse[]>(reviews);
  const [localRating, setLocalRating] = useState<number | null>(averageRating);

  useEffect(() => {
    setLocalReviews(reviews);
    setLocalRating(averageRating);
  }, [reviews, averageRating]);

  if (initialIsFavorite !== prevInitialIsFavorite) {
    setIsFavorite(initialIsFavorite);
    setPrevInitialIsFavorite(initialIsFavorite);
  }

  const handleOpenPurchaseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPurchaseModalOpen(true);
  };

  const handleOpenDetails = async () => {
    try {
      const freshListing = await listingService.getById(id);
      
      setLocalReviews(freshListing.reviews);
      
      if (freshListing.reviews.length > 0) {
        const newAvg = freshListing.reviews.reduce((sum, rev) => sum + rev.rating, 0) / freshListing.reviews.length;
        setLocalRating(newAvg);
      }
      
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error al refrescar datos de la propiedad:", error);
      setIsDetailsModalOpen(true);
    }
  };

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    try {
      await onPurchaseConfirm(id);
      setIsPurchaseModalOpen(false);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
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
      console.error("Error al actualizar favoritos:", error);
    }
  };

  const handleReviewSubmit = async (listingId: number, rating: number, comment: string) => {
    const newReview = await listingService.addReview(listingId, { rating, comment });
    
    const updatedReviews = [...localReviews, newReview];
    setLocalReviews(updatedReviews);
    
    const newAvg = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0) / updatedReviews.length;
    setLocalRating(newAvg);
  };

  return (
    <>
      <div 
        onClick={handleOpenDetails}
        className="group cursor-pointer space-y-3 active:scale-[0.99] transition-all duration-150 bg-white rounded-2xl p-2 border border-transparent hover:border-slate-100 hover:shadow-xs relative"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-200"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-900 rounded-xl shadow-xs border border-slate-200/50">
            {realEstateName}
          </span>
          
          {localRating != null && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 flex items-center gap-1 text-xs font-bold bg-slate-900/90 backdrop-blur-xs text-white rounded-xl shadow-xs border border-slate-700/50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              {localRating.toFixed(1)}
            </span>
          )}

          {userRole === 'client' && (
            <button
              type="button"
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs hover:bg-white rounded-xl transition-all shadow-xs text-amber-500 active:scale-90 border border-slate-200/20 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 transition-transform group-hover:scale-110"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499c.151-.326.617-.326.768 0l2.124 4.592 4.937.697c.36.051.503.504.234.757l-3.606 3.424 1.011 5.006c.074.364-.32.659-.636.471L12 16.142l-4.428 2.396c-.317.189-.711-.107-.636-.47l1.011-5.006L4.34 9.545c-.269-.253-.125-.706.234-.757l4.937-.697 2.124-4.592z"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-1 px-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-slate-900 text-sm tracking-tight line-clamp-1 flex-1">
              {location}
            </h3>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap pt-0.5">
              {type === 'house' ? 'Casa' : 'Depto'}
            </div>
          </div>
          
          <p className="text-xs text-slate-700 font-medium line-clamp-1">
            {title}
          </p>

          <p className="text-xs text-slate-400 font-medium line-clamp-2 min-h-8 pt-0.5 leading-relaxed">
            {characteristics || 'Sin descripción adicional disponible.'}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
            <span className="text-sm font-bold text-slate-900">
              USD {price.toLocaleString('es-AR')}
            </span>
            
            {userRole === 'client' && (
              <button
                type="button"
                onClick={handleOpenPurchaseModal}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-xs"
              >
                Comprar
              </button>
            )}
          </div>
        </div>
      </div>

      <PurchaseListingModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title={title}
        price={price}
        onConfirm={handleConfirmPurchase}
        isSubmitting={isSubmitting}
      />

      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        property={{
          id,
          title,
          location,
          price,
          image,
          type,
          realEstateName,
          characteristics,
          averageRating: localRating, 
          reviews: localReviews       
        }}
        userRole={userRole}
        onReviewSubmit={handleReviewSubmit}
      />
    </>
  );
};