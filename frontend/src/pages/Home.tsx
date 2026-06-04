import React from 'react';
import { SearchBar, PropertyCard } from '@/components/home/index.ts';
import { Link } from 'react-router-dom';
import { useHome } from '@/hooks/useHome';
import { ErrorMessage } from '@/components/ui';
import { LogoutButton } from '@/components/ui/LogoutButton';

export const Home: React.FC = () => {
  const { listings, isLoading, error, isLoggedIn, userRole, handleLogout } = useHome();

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-blue-600 tracking-tight">
            Compra Tu Hogar
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          {isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className="hover:text-slate-900 active:scale-[0.99] transition-all cursor-pointer text-blue-600 font-bold"
                >
                  Panel Admin
                </Link>
              )}

              {userRole === 'real-estate' && (
                <Link
                  to="/real-estate"
                  className="hover:text-slate-900 active:scale-[0.99] transition-all cursor-pointer text-blue-600 font-bold"
                >
                  Panel Inmobiliaria
                </Link>
              )}

              <div className="w-36">
                <LogoutButton onLogout={handleLogout} />
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hover:text-slate-900 active:scale-[0.99] transition-all cursor-pointer"              >
                Registrarme
              </Link>
              <Link
                to="/login"
                className="hover:text-slate-900 active:scale-[0.99] transition-all cursor-pointer"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="bg-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Busca tu <span className="text-blue-600">hogar ideal</span> con nosotros.
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Explorá las mejores propiedades publicadas por las inmobiliarias más confiables.
          </p>
        </div>

        <SearchBar />
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <ErrorMessage message={error} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-3 animate-pulse">
                <div className="aspect-square bg-slate-100 rounded-2xl w-full" />
                <div className="h-4 bg-slate-100 rounded-xl w-3/4" />
                <div className="h-3 bg-slate-50 rounded-xl w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">No hay propiedades publicadas en venta en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {listings.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}       
                location={property.location}  
                price={property.price}
                image={property.image}
                type={property.type}        
                realEstateName={property.realEstateName}
                characteristics={property.characteristics} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};