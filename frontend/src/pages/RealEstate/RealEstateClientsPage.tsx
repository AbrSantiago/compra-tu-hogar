import React from 'react';
import { useParams } from 'react-router-dom';
import { useRealEstateClients } from '@/hooks/useRealEstateClients';
import { AdminHeader, AdminTable } from '@/components/admin';
import { ErrorMessage } from '@/components/ui';

export const RealEstateClientsPage: React.FC = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { clients, isLoading, error } = useRealEstateClients(realEstateId);

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Mis Clientes" 
        description="Listado de clientes que han interactuado con esta inmobiliaria." 
      />

      <ErrorMessage message={error} />

      <AdminTable
        isLoading={isLoading}
        data={clients}
        headers={['ID', 'Nombre', 'Email', 'Apellido']}
        emptyMessage="Aún no hay clientes asociados a esta inmobiliaria."
        renderRow={(client) => (
          <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">{client.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-900">{client.name}</td>
            <td className="px-6 py-4 text-slate-600">{client.email}</td>
            <td className="px-6 py-4 text-slate-600">{client.surname}</td>
          </tr>
        )}
      />
    </div>
  );
};