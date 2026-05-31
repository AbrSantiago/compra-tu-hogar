import React from 'react';
import { useAdminClients } from '@/hooks/useAdminClients';
import { ErrorMessage } from '@/components/ui';

export const AdminClientsPage: React.FC = () => {
  const { clients, isLoading, error } = useAdminClients();

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Control de Clientes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Listado de usuarios registrados en la plataforma como clientes compradores.
        </p>
      </div>

      <ErrorMessage message={error} />

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse w-full" />
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse w-full" />
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse w-full" />
        </div>
      ) : clients.length === 0 && !error ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-500 font-medium">No hay clientes registrados de momento.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nombre Completo</th>
                  <th className="px-6 py-4">Correo Electrónico</th>
                  <th className="px-6 py-4 text-right">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-400">
                      #{client.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {client.name} {client.surname}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {client.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};