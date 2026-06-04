import React from 'react';
import { useAdminClients } from '@/hooks/useAdminClients';
import { ErrorMessage } from '@/components/ui';
import { AdminHeader, AdminTable } from '@/components/admin';

export const AdminClientsPage: React.FC = () => {
  const { clients, isLoading, error } = useAdminClients();

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Control de Clientes" 
        description="Listado de los clientes registrados en la plataforma." 
      />

      <ErrorMessage message={error} />

      <AdminTable
        isLoading={isLoading}
        data={clients}
        headers={['ID', 'Nombre Completo', 'Email']}
        emptyMessage="No hay clientes registrados aún."
        renderRow={(client) => (
          <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">#{client.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-900">{client.name} {client.surname}</td>
            <td className="px-6 py-4 text-slate-600">{client.email}</td>
          </tr>
        )}
      />
    </div>
  );
};