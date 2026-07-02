import React, { useEffect, useState } from 'react';
import { clientService } from '@/services/clientService';
import { Link } from 'react-router-dom';
import type { ListingResponse } from '@/types/listing';

export const ClientPurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const clientId = Number(localStorage.getItem('userId')) || 1;
        const data = await clientService.getPurchases(clientId);
        setPurchases(data);
      } catch (error) {
        console.error("Error al buscar las compras:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

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
            {[1, 2].map((n) => (
              <div key={n} className="space-y-3 animate-pulse bg-white p-4 rounded-2xl border border-slate-100">
                <div className="aspect-square bg-slate-100 rounded-xl w-full" />
                <div className="h-4 bg-slate-100 rounded-xl w-3/4" />
                <div className="h-3 bg-slate-50 rounded-xl w-1/2" />
              </div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white max-w-md mx-auto space-y-3 p-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full w-fit mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="text-md font-semibold text-slate-900">Aún no compraste ninguna propiedad</h3>
            <p className="text-xs text-slate-500">Explorá el catálogo del home para realizar tu primera adquisición inmobiliaria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((list) => (
              <div key={list.id} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-xs space-y-3 relative">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={list.property?.type === 'house'
                      ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
                      : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
                    }
                    alt="Propiedad"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg shadow-xs uppercase tracking-wider">
                    Adquirido
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{list.property?.location || 'Buenos Aires'}</h3>
                  <p className="text-xs text-slate-600 truncate">{list.property?.address}</p>
                  <div className="pt-2 flex justify-between items-center border-t border-slate-50">
                    <span className="text-sm font-bold text-slate-900">USD {list.price.toLocaleString('es-AR')}</span>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                      {list.property?.type === 'house' ? 'Casa' : 'Depto'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};