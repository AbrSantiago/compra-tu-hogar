import React from 'react';
import { useParams } from 'react-router-dom';
import { useRealEstateSales } from '@/hooks/useRealEstateSales';
import { AdminHeader, AdminTable } from '@/components/admin';
import { ErrorMessage } from '@/components/ui';

export const RealEstateSalesPage: React.FC = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { sales, isLoading, error } = useRealEstateSales(realEstateId);

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Ventas Realizadas" 
        description="Historial detallado de todas las propiedades vendidas por esta inmobiliaria." 
      />

      <ErrorMessage message={error} />

      <AdminTable
        isLoading={isLoading}
        data={sales}
        headers={['ID', 'Propiedad', 'Comprador', 'Precio Final']}
        emptyMessage="Aún no hay ventas registradas para esta inmobiliaria."
        renderRow={(sale) => (
          <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">{sale.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-900">{sale.property?.address || 'Sin dirección'}</td>
            <td className="px-6 py-4 text-slate-600">
              {sale.buyer ? `${sale.buyer.name} ${sale.buyer.surname}` : 'Cliente externo'}
            </td>
            <td className="px-6 py-4 font-bold text-emerald-600">
              USD {sale.price.toLocaleString('es-AR')}
            </td>
          </tr>
        )}
      />
    </div>
  );
};