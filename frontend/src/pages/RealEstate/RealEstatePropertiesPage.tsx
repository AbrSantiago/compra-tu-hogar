import React from 'react';
import { useRealEstate } from '@/hooks/useRealEstate';
import { FloatingInput, SubmitButton } from '@/components/form';
import { ErrorMessage } from '@/components/ui';
import { AdminHeader, AdminTable, SuccessMessage } from '@/components/admin';

export const RealEstatePropertiesPage: React.FC = () => {
  const {
    properties,
    isLoading,
    error,
    propAddress,
    setPropAddress,
    propLocation,
    setPropLocation,
    propType,
    setPropType,
    propCharacteristics,
    setPropCharacteristics,
    handleCreatePropertySubmit,
    isSubmitting,
    formError,
    formSuccess,
  } = useRealEstate();

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Mis Inmuebles" 
        description="Registrá y administrá las propiedades de tu catálogo interno." 
      />

      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Registrar Propiedad</h3>
            <p className="text-sm text-slate-500 mt-1">Ingresá los datos del inmueble.</p>
          </div>

          <ErrorMessage message={formError} />
          {formSuccess && <SuccessMessage message={formSuccess} />}

          <form onSubmit={handleCreatePropertySubmit} className="space-y-4">
            <FloatingInput 
              type="text" 
              name="address" 
              label="Dirección (Ej: Av. Santa Fe 1234)" 
              value={propAddress} 
              onChange={(e) => setPropAddress(e.target.value)} 
              required 
            />
            
            <FloatingInput 
              type="text" 
              name="location" 
              label="Ubicación / Zona (Ej: Palermo, CABA)" 
              value={propLocation} 
              onChange={(e) => setPropLocation(e.target.value)} 
              required 
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Tipo de Unidad</label>
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value as 'house' | 'apartment')}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer font-medium"
              >
                <option value="apartment">Departamento</option>
                <option value="house">Casa</option>
              </select>
            </div>

            <FloatingInput 
              type="text" 
              name="characteristics" 
              label="Características (Ej: 3 dorm, 2 baños, balcón)" 
              value={propCharacteristics} 
              onChange={(e) => setPropCharacteristics(e.target.value)} 
            />

            <SubmitButton 
              isLoading={isSubmitting} 
              text="Registrar Unidad" 
              loadingText="Guardando..." 
            />
          </form>
        </div>

        <div className="lg:col-span-2">
          <AdminTable
            isLoading={isLoading}
            data={properties}
            headers={['ID', 'Dirección', 'Ubicación / Zona', 'Tipo']}
            emptyMessage="Aún no cargaste ninguna propiedad física."
            renderRow={(prop) => (
              <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{prop.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{prop.address}</td>
                <td className="px-6 py-4 text-slate-600">{prop.location}</td>
                <td className="px-6 py-4 capitalize">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold ${
                    prop.type === 'apartment' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {prop.type === 'apartment' ? 'Departamento' : 'Casa'}
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