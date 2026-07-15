import React, { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { AdminHeader, AdminTable } from '@/components/admin';
import { useAdminStats } from '@/hooks/useAdminStats.tsx'; 

type TabType = 'clients' | 'properties' | 'realEstates';

export const AdminStatsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clients');
  
  const { 
    topClients, 
    topProperties, 
    topRealEstates, 
    isLoading, 
    error 
  } = useAdminStats();

  const getTabClass = (tab: TabType) => {
    const baseClass = "px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200";
    if (activeTab === tab) {
      return `${baseClass} bg-blue-50 text-blue-700 border-blue-200 shadow-xs`;
    }
    return `${baseClass} bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900`;
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Reportes y Estadísticas" 
        description="Visualizá el rendimiento y la actividad general de la plataforma." 
      />

      <ErrorMessage message={error} />

      <div className="flex flex-wrap gap-3 pb-2 border-b border-slate-100">
        <button onClick={() => setActiveTab('clients')} className={getTabClass('clients')}>
          Top Clientes
        </button>
        <button onClick={() => setActiveTab('properties')} className={getTabClass('properties')}>
          Propiedades Más Vendidas
        </button>
        <button onClick={() => setActiveTab('realEstates')} className={getTabClass('realEstates')}>
          Top Inmobiliarias
        </button>
      </div>
      
      {activeTab === 'clients' && (
        <AdminTable
          isLoading={isLoading}
          data={topClients}
          headers={['Ranking', 'Cliente', 'Total de Compras']}
          emptyMessage="No hay datos suficientes para mostrar estadísticas de clientes."
          renderRow={(client, index) => (
            <tr key={index} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-slate-400">#{index + 1}</td>
              <td className="px-6 py-4 font-semibold text-slate-900">{client.name} {client.surname}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {client.total} compras
                </span>
              </td>
            </tr>
          )}
        />
      )}

      {activeTab === 'properties' && (
        <AdminTable
          isLoading={isLoading}
          data={topProperties}
          headers={['Ranking', 'Propiedad (Dirección)', 'Total de Ventas']}
          emptyMessage="No hay datos suficientes para mostrar estadísticas de propiedades."
          renderRow={(prop, index) => (
            <tr key={index} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-slate-400">#{index + 1}</td>
              <td className="px-6 py-4 font-semibold text-slate-900">{prop.address}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {prop.total} ventas
                </span>
              </td>
            </tr>
          )}
        />
      )}

      {activeTab === 'realEstates' && (
        <AdminTable
          isLoading={isLoading}
          data={topRealEstates}
          headers={['Ranking', 'Inmobiliaria', 'Total de Ventas']}
          emptyMessage="No hay datos suficientes para mostrar estadísticas de inmobiliarias."
          renderRow={(realEstate, index) => (
            <tr key={index} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-slate-400">#{index + 1}</td>
              <td className="px-6 py-4 font-semibold text-slate-900">{realEstate.name}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {realEstate.total} ventas
                </span>
              </td>
            </tr>
          )}
        />
      )}
      
    </div>
  );
};