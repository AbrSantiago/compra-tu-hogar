import React from 'react';
import { AdminHeader, AdminTable } from '@/components/admin';
import { ErrorMessage } from '@/components/ui';
import { EditModal } from '@/components/modals/EditModal';
import { DeleteModal } from '@/components/modals/DeleteModal';
import { FloatingInput } from '@/components/form';
import { useAdminProperties } from '@/hooks/useAdminProperties';

export const AdminPropertiesPage: React.FC = () => {
  const {
    properties, isLoading, error, isEditModalOpen, isDeleteModalOpen, isSubmitting,
    editAddress, setEditAddress, editLocation, setEditLocation,
    openEditModal, openDeleteModal, closeEditModal, closeDeleteModal, onConfirmEdit, onConfirmDelete, editType, setEditType
  } = useAdminProperties();

  return (
    <div className="space-y-6">
      <AdminHeader title="Inmuebles Registrados" description="Registro de inmuebles y nivel de interés." />
      <ErrorMessage message={error} />

      <AdminTable
        isLoading={isLoading}
        data={properties}
        headers={['ID', 'Dirección', 'Localidad', 'Tipo', 'Guardados', 'Acciones']}
        renderRow={(prop) => (
          <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">{prop.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-900">{prop.address}</td>
            <td className="px-6 py-4 text-slate-600">{prop.location}</td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                prop.type === 'apartment' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {prop.type === 'apartment' ? 'Departamento' : 'Casa'}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-rose-500"><path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" /></svg>
                {prop.total_saves ?? 0}
              </span>
            </td>
            <td className="px-6 py-4 space-x-2 whitespace-nowrap">
              <button onClick={() => openEditModal(prop)} title="Editar" className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
              </button>
              <button onClick={() => openDeleteModal(prop)} title="Eliminar" className="inline-flex items-center justify-center p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </td>
          </tr>
        )}
      />
 
      <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Propiedad" subtitle="Actualizá los datos de la propiedad" onSubmit={onConfirmEdit} isSubmitting={isSubmitting}>
        <FloatingInput name="address" label="Dirección" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required />
        <FloatingInput name="location" label="Localidad" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Propiedad</label>
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value as 'house' | 'apartment')}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
          </select>
        </div>
      </EditModal>

      <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="¿Eliminar propiedad?" description="Se borrará permanentemente." onConfirm={onConfirmDelete} isSubmitting={isSubmitting} />
    </div>
  );
};