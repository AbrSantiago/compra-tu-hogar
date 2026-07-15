import React from 'react';
import { AdminHeader, AdminTable } from '@/components/admin';
import { ErrorMessage } from '@/components/ui';
import { STATUS_LABELS } from '@/hooks/useListingsManager';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { EditModal } from '@/components/modals/EditModal';
import { DeleteModal } from '@/components/modals/DeleteModal';
import { FloatingInput } from '@/components/form/FloatingInput';
import { ReviewPagination } from '@/components/admin/ReviewPagination';

export const AdminReviewsPage: React.FC = () => {
    const {
        allListings, isLoading, error,
        isEditModalOpen, isDeleteModalOpen, isSubmitting,
        editPrice, setEditPrice, editStatus, setEditStatus,
        openEditModal, openDeleteModal, closeEditModal, closeDeleteModal,
        onConfirmEdit, onConfirmDelete
    } = useAdminDashboard();

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Auditoría de Publicaciones"
                description="Estado actual de las publicaciones y el feedback de los usuarios."
            />
            <ErrorMessage message={error} />

            <AdminTable
                isLoading={isLoading}
                data={allListings}
                headers={['Publicación', 'Precio', 'Estado', 'Puntaje', 'Reseñas', 'Acciones']}
                emptyMessage="No hay publicaciones registradas."
                renderRow={(listing) => {
                    const statusStyles: Record<string, string> = {
                        active: 'bg-blue-50 text-blue-700 border-blue-100',
                        reserved: 'bg-purple-50 text-purple-700 border-purple-100',
                        sold: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        paused: 'bg-amber-50 text-amber-700 border-amber-100',
                    };
                    const badgeClass = statusStyles[listing.status] || 'bg-slate-50 text-slate-700 border-slate-100';

                    return (
                        <tr key={listing.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
                            <td className="px-6 py-4 align-top">
                                <span className="font-mono text-xs text-slate-400">{listing.id}</span>
                                <p className="font-semibold text-sm text-slate-900 mt-1">{listing.property?.address || 'Sin dirección'}</p>
                                <p className="text-xs text-slate-500">{listing.real_estate?.name || 'Sin inmobiliaria'}</p>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-900">USD {listing.price.toLocaleString('es-AR')}</td>
                            <td className="px-6 py-4 align-top">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${badgeClass}`}>
                                    {STATUS_LABELS[listing.status] || listing.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                                {listing.average_rating ? (
                                    <span className="flex items-center gap-1 font-bold text-amber-500">★ {listing.average_rating.toFixed(1)}</span>
                                ) : <span className="text-xs text-slate-400">Sin calificar</span>}
                            </td>
                            <td className="px-6 py-4">
                                {listing.reviews?.length > 0 ? (
                                    <details className="group">
                                        <summary className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 list-none">Ver {listing.reviews.length} reseña(s) ▼</summary>
                                        <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                            <ReviewPagination reviews={listing.reviews} />
                                        </div>
                                    </details>
                                ) : <span className="text-xs text-slate-400">Sin reseñas</span>}
                            </td>
                            <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                <button
                                    onClick={() => openEditModal(listing)}
                                    title="Editar"
                                    className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all shadow-xs"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => openDeleteModal(listing)}
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

            <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Publicación" subtitle="Modificá los valores" onSubmit={onConfirmEdit} isSubmitting={isSubmitting}>
                <FloatingInput type="number" name="price" label="Precio (USD)" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className="w-full px-4 py-3 border rounded-xl">
                    <option value="active">Activo</option>
                    <option value="reserved">Reservado</option>
                    <option value="sold">Vendido</option>
                    <option value="paused">Pausado</option>
                </select>
            </EditModal>

            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="¿Eliminar?" description="Acción irreversible." onConfirm={onConfirmDelete} isSubmitting={isSubmitting} />
        </div>
    );
};