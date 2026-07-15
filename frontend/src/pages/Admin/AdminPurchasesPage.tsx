import React from 'react';
import { AdminHeader, AdminTable } from '@/components/admin';
import { ErrorMessage } from '@/components/ui';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export const AdminPurchasesPage: React.FC = () => {
  const { purchases, isLoading, error } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Registro de Ventas" 
        description="Historial de todas las transacciones completadas en la plataforma." 
      />
      
      <ErrorMessage message={error} />
      
      <AdminTable
        isLoading={isLoading}
        data={purchases}
        headers={['ID Publicación', 'Propiedad', 'Comprador', 'Inmobiliaria', 'Monto']}
        emptyMessage="Aún no se han registrado ventas."
        renderRow={(purchase) => (
          <tr key={purchase.id} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">#{purchase.id}</td>
            <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[200px]" title={purchase.property?.address}>
              {purchase.property?.address || 'Sin dirección'}
            </td>
            <td className="px-6 py-4 font-semibold text-blue-700">
              {purchase.buyer ? `${purchase.buyer.name} ${purchase.buyer.surname}` : 'N/A'}
            </td>
            <td className="px-6 py-4 text-slate-600">
              {purchase.real_estate?.name || 'N/A'}
            </td>
            <td className="px-6 py-4 font-bold text-emerald-600 whitespace-nowrap">
              USD {purchase.price.toLocaleString('es-AR')}
            </td>
          </tr>
        )}
      />
    </div>
  );
};