import React from 'react';
import { PurchaseListingModal } from '../modals/PurchaseListingModal';
import { PropertyDetailsModal } from '../modals/PropertyDetailsModal';
import { usePropertyCard } from '@/hooks/usePropertyCard';
import type { ReviewResponse } from '@/types/review';

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

export const PropertyCard: React.FC<PropertyCardProps> = (props) => {
  const { state, actions } = usePropertyCard(
    props.id, props.reviews || [], props.averageRating || null, props.initialIsFavorite || false
  );

  return (
    <>
      <div 
        onClick={actions.openDetails}
        className="group cursor-pointer space-y-3 active:scale-[0.99] transition-all duration-150 bg-white rounded-2xl p-2 border border-transparent hover:border-slate-100 hover:shadow-xs relative"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
          <img src={props.image} alt={props.title} className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-200" />
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-900 rounded-xl shadow-xs border border-slate-200/50">
            {props.realEstateName}
          </span>
          
          {state.localRating != null && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 flex items-center gap-1 text-xs font-bold bg-amber-400/80 backdrop-blur-xs text-white rounded-xl shadow-xs border border-amber-500/50">
              ★ {state.localRating.toFixed(1)}
            </span>
          )}

          {props.userRole === 'client' && (
            <button type="button" onClick={actions.toggleFavorite} className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs hover:bg-white rounded-xl transition-all shadow-xs text-amber-500 active:scale-90 border border-slate-200/20 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={state.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4 transition-transform group-hover:scale-110"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.151-.326.617-.326.768 0l2.124 4.592 4.937.697c.36.051.503.504.234.757l-3.606 3.424 1.011 5.006c.074.364-.32.659-.636.471L12 16.142l-4.428 2.396c-.317.189-.711-.107-.636-.47l1.011-5.006L4.34 9.545c-.269-.253-.125-.706.234-.757l4.937-.697 2.124-4.592z" /></svg>
            </button>
          )}
        </div>

        <div className="px-1 space-y-1">
          <h3 className="font-semibold text-sm truncate">{props.location}</h3>
          <p className="text-xs text-slate-700 truncate">{props.title}</p>
          
          {props.characteristics && (
            <p className="text-xs text-slate-400 italic truncate">
              {props.characteristics}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold">USD {props.price.toLocaleString('es-AR')}</span>
            {props.userRole === 'client' && (
              <button onClick={(e) => { e.stopPropagation(); actions.setIsPurchaseModalOpen(true); }} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700">Comprar</button>
            )}
          </div>
        </div>
      </div>

      <PurchaseListingModal
        isOpen={state.isPurchaseModalOpen}
        onClose={() => actions.setIsPurchaseModalOpen(false)}
        title={props.title}
        price={props.price}
        onConfirm={() => actions.confirmPurchase(props.onPurchaseConfirm)}
        isSubmitting={state.isSubmitting}
      />

      <PropertyDetailsModal
        isOpen={state.isDetailsModalOpen}
        onClose={() => actions.setIsDetailsModalOpen(false)}
        property={{ ...props, title: props.title, averageRating: state.localRating, reviews: state.localReviews }}
        userRole={props.userRole}
        onReviewSubmit={actions.addReview}
      />
    </>
  );
};