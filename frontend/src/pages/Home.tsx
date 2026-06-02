import React from 'react';
import { SearchBar, PropertyCard } from '@/components/home/index.ts';
import { Link } from 'react-router-dom';

const MOCK_PROPERTIES = [
  { id: 1, title: 'Hermoso departamento con balcón terraza y vista abierta', location: 'Palermo, CABA', price: 145000, realEstateName: 'RE/MAX Premium', beds: 2, baths: 1, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Moderna casa minimalista con piscina y jardín parquizado', location: 'Nordelta, Tigre', price: 420000, realEstateName: 'L.J. Ramos', beds: 4, baths: 3, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Duplex a estrenar en zona residencial muy tranquila', location: 'San Isidro, GBA Norte', price: 210000, realEstateName: 'Toribio Achaval', beds: 3, baths: 2, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Monoambiente luminoso ideal inversión o primera vivienda', location: 'Belgrano, CABA', price: 89000, realEstateName: 'RE/MAX Premium', beds: 1, baths: 1, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">

      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-blue-600 tracking-tight">
            Compra Tu Hogar
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <Link
            to="/register"
            className="hover:text-slate-900 active:scale-[0.99] transition-all cursor-pointer"
          >
            Registrarme
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl transition-all active:scale-[0.99] cursor-pointer text-center"
          >
            Iniciar Sesión
          </Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {MOCK_PROPERTIES.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price}
              image={property.image}
              realEstateName={property.realEstateName}
              beds={property.beds}
              baths={property.baths}
            />
          ))}
        </div>
      </main>

    </div>
  );
};