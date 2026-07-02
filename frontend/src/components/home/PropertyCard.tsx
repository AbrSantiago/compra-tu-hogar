import React, { useState, useEffect } from 'react';
import { PurchaseListingModal } from '../modals/PurchaseListingModal';
import { clientService } from '@/services/clientService'; 

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
  initialIsFavorite = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    try {
      await onPurchaseConfirm(id);
      setIsModalOpen(false);
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

  return (
    <>
      <div className="group cursor-pointer space-y-3 active:scale-[0.99] transition-all duration-150 bg-white rounded-2xl p-2 border border-transparent hover:border-slate-100 hover:shadow-xs relative">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-200"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-900 rounded-xl shadow-xs border border-slate-200/50">
            {realEstateName}
          </span>

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
                onClick={handleOpenModal}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-xs"
              >
                Comprar
              </button>
            )}
          </div>
        </div>
      </div>

      <PurchaseListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        price={price}
        onConfirm={handleConfirmPurchase}
        isSubmitting={isSubmitting}
      />
    </>
  );
};