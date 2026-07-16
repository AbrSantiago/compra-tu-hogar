import React from 'react';
import { useClientPurchases } from '@/hooks/useClientPurchases';
import { Link } from 'react-router-dom';
import { PropertyCard } from '@/components/home/PropertyCard';

export const ClientPurchasesPage: React.FC = () => {
  const { purchases, isLoading } = useClientPurchases();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full rounded-b-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mis Propiedades</h1>
        </div>
        <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline">Volver al Home</Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white max-w-md mx-auto space-y-3 p-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full w-fit mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="text-md font-semibold text-slate-900">Aún no compraste ninguna propiedad</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((list) => (
              <PropertyCard
                key={list.id}
                id={list.id}
                title={list.property?.address || 'Sin dirección'}
                location={list.property?.location || 'Buenos Aires'}
                price={list.price}
                image={list.image}
                type={list.property?.type === 'house' ? 'house' : 'apartment'}
                realEstateName={list.real_estate?.name || 'Inmobiliaria'}
                characteristics={list.property?.characteristics || null}
                userRole={null}
                onToggleFavorite={() => { }}
                onPurchaseConfirm={async () => { }}
                onReviewAdded={() => { }}
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