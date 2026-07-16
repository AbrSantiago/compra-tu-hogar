import React from 'react';
import { useListingsManager, STATUS_LABELS } from '@/hooks/useListingsManager';
import { FloatingInput, SubmitButton } from '@/components/form';
import { ErrorMessage } from '@/components/ui';
import { AdminHeader, AdminTable, SuccessMessage } from '@/components/admin';
import { EditModal } from '@/components/modals/EditModal';
import { DeleteModal } from '@/components/modals/DeleteModal';
import type { ListingStatus } from '@/types/listing';

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
    isEditModalOpen,
    isDeleteModalOpen,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
    onConfirmEdit,
    onConfirmDelete,
  } = useListingsManager();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Publicaciones"
        description="Crea y gestioná tus publicaciones."
      />

      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Publicar Inmueble</h3>
            <p className="text-sm text-slate-500 mt-1">Realiza la publicación de un inmueble con un precio de venta.</p>
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
                <option value="">Elegir propiedad</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.id}. {prop.address} ({prop.location})
                  </option>
                ))}
              </select>
            </div>

            <FloatingInput
              type="number"
              name="price"
              label="Precio (USD)"
              min="0"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              required
            />

            <SubmitButton
              isLoading={isSubmitting}
              text="Publicar"
              loadingText="Publicando"
            />
          </form>
        </div>

        <div className="lg:col-span-2">
          <AdminTable
            isLoading={isLoading}
            data={listings}
            headers={['ID', 'Propiedad', 'Precio', 'Estado', 'Acciones']}
            emptyMessage="No tenés publicaciones aún."
            renderRow={(list) => {
              const statusStyles: Record<string, string> = {
                active: 'bg-blue-50 text-blue-700 border-blue-100',
                reserved: 'bg-purple-50 text-purple-700 border-purple-100',
                sold: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                paused: 'bg-amber-50 text-amber-700 border-amber-100',
              };

              const currentBadgeClass = statusStyles[list.status] || 'bg-slate-50 text-slate-700 border-slate-100';

              return (
                <tr key={list.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{list.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 truncate max-w-[200px]" title={list.property?.address}>
                    {list.property?.address || `Propiedad #${list.property_id}`}
                  </td>
                  <td className="px-6 py-4 text-slate-900">USD {list.price.toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${currentBadgeClass}`}>
                      {STATUS_LABELS[list.status] || list.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(list)}
                      title="Editar"
                      className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all shadow-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(list)}
                      title="Eliminar"
                      className="inline-flex items-center justify-center p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all shadow-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            }}
          />
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Editar Publicación"
        subtitle="Modificá los valores de la publicación"
        onSubmit={onConfirmEdit}
        isSubmitting={isSubmitting}
      >
        <FloatingInput
          type="number"
          name="price"
          label="Precio (USD)"
          min="0"
          value={editPrice}
          onChange={(e) => setEditPrice(e.target.value)}
          required
        />
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Estado de la publicación</label>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as ListingStatus)}
            className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer font-medium"
            required
          >
            <option value="active">Activo</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
            <option value="paused">Pausado</option>
          </select>
        </div>
      </EditModal>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="¿Eliminar publicación?"
        description="¿Seguro que querés eliminar la publicación? Esta acción no se puede deshacer y el inmueble dejará de estar visible en el mercado."
        onConfirm={onConfirmDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};