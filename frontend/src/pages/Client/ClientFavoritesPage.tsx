import React from 'react';
import { useClientFavorites } from '@/hooks/useClientFavorites';
import { listingService } from '@/services/listingService';
import { Link } from 'react-router-dom';
import { PropertyCard } from '@/components/home/PropertyCard';
import { getPropertyImage } from '@/utils/imageMapper';

export const ClientFavoritesPage: React.FC = () => {
  const { favorites, isLoading, refetch } = useClientFavorites();

  const handlePurchase = async (id: number) => {
    await listingService.purchase(id);
    refetch();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full rounded-b-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mis Favoritos</h1>
        </div>
        <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline">Volver al Home</Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white max-w-md mx-auto space-y-3 p-6">
            <h3 className="text-md font-semibold text-slate-900">No tenés favoritos guardados</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites
              .filter((list) => list.status === 'active')
              .map((list) => (
                <PropertyCard
                  key={list.id}
                  id={list.id}
                  title={list.property?.address || 'Sin dirección'}
                  location={list.property?.location || 'Buenos Aires'}
                  price={list.price}
                  image={getPropertyImage(list.id)}
                  type={list.property?.type === 'house' ? 'house' : 'apartment'}
                  realEstateName={list.real_estate?.name || 'Inmobiliaria'}
                  characteristics={list.property?.characteristics || null}
                  userRole="client"
                  initialIsFavorite={true}
                  onToggleFavorite={refetch}
                  onPurchaseConfirm={handlePurchase}
                  onReviewAdded={refetch}
                  averageRating={list.average_rating}
                  reviews={list.reviews}
                />
              ))}
          </div>
        )}
      </main>
    </div>
  );
};