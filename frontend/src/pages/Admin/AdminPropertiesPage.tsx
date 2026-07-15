import React from 'react';
import { AdminHeader, AdminTable } from '@/components/admin';
import { ErrorMessage } from '@/components/ui';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export const AdminPropertiesPage: React.FC = () => {
  const { propertiesSaves, isLoading, error } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Inmuebles Registrados" 
        description="Inventario global de propiedades y su nivel de interés (guardados en favoritos)." 
      />
      
      <ErrorMessage message={error} />
      
      <AdminTable
        isLoading={isLoading}
        data={propertiesSaves}
        headers={['ID', 'Dirección', 'Tipo', 'Veces Guardado']}
        emptyMessage="No hay propiedades registradas."
        renderRow={(prop) => (
          <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">#{prop.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-900">{prop.address}</td>
            <td className="px-6 py-4 text-slate-600 capitalize">
              {prop.type === 'house' ? 'Casa' : 'Departamento'}
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                </svg>
                {prop.total_saves}
              </span>
            </td>
          </tr>
        )}
      />
    </div>
  );
};