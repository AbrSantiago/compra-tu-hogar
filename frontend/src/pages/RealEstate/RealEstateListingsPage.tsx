import React from 'react';
import { useRealEstate } from '@/hooks/useRealEstate';
import { FloatingInput, SubmitButton } from '@/components/form';
import { ErrorMessage } from '@/components/ui';
import { AdminHeader, AdminTable, SuccessMessage } from '@/components/admin';

export const RealEstateListingsPage: React.FC = () => {
  const {
    properties,
    listings,
    isLoading,
    error,
    selectedPropertyId,
    setSelectedPropertyId,
    listingPrice,
    setListingPrice,
    handleCreateListingSubmit,
    isSubmitting,
    formError,
    formSuccess,
  } = useRealEstate();

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Publicaciones" 
        description="Asigná precios y gestioná tus publicaciones activas." 
      />

      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Publicar al Mercado</h3>
            <p className="text-sm text-slate-500 mt-1">Vinculá un inmueble físico con un valor de venta.</p>
          </div>

          <ErrorMessage message={formError} />
          {formSuccess && <SuccessMessage message={formSuccess} />}

          <form onSubmit={handleCreateListingSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Seleccionar Propiedad</label>
              <select
                value={selectedPropertyId || ''}
                onChange={(e) => setSelectedPropertyId(Number(e.target.value) || null)}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer font-medium"
                required
              >
                <option value="">-- Elegir propiedad física --</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    #{prop.id} - {prop.address} ({prop.location})
                  </option>
                ))}
              </select>
            </div>

            <FloatingInput 
              type="number" 
              name="price" 
              label="Precio de Venta (USD)" 
              value={listingPrice} 
              onChange={(e) => setListingPrice(e.target.value)} 
              required 
            />

            <SubmitButton 
              isLoading={isSubmitting} 
              text="Lanzar Publicación" 
              loadingText="Publicando..." 
            />
          </form>
        </div>

        <div className="lg:col-span-2">
          <AdminTable
            isLoading={isLoading}
            data={listings}
            headers={['ID', 'ID Propiedad', 'Precio Comercial', 'Estado']}
            emptyMessage="No tenés publicaciones activas en la cartelera de ofertas."
            renderRow={(list) => (
              <tr key={list.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{list.id}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">#{list.property_id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">USD {list.price.toLocaleString('es-AR')}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                    {list.status}
                  </span>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );
};