import React from 'react';
import { AdminHeader, AdminTable } from '@/components/admin';
import { ErrorMessage } from '@/components/ui';
import { STATUS_LABELS } from '@/hooks/useListingsManager';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

const ReviewPagination = ({ reviews }: { reviews: any[] }) => {
    const [page, setPage] = React.useState(0);
    const pageSize = 3;
    const paginated = reviews.slice(page * pageSize, (page + 1) * pageSize);
    const totalPages = Math.ceil(reviews.length / pageSize);

    return (
        <div className="space-y-2">
            {paginated.map((rev) => (
                <div key={rev.id} className="border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-700">{rev.client_name}</span>
                        <span className="text-xs font-bold text-amber-500">★ {rev.rating}</span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                </div>
            ))}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <button
                        onClick={(e) => { e.stopPropagation(); setPage(p => Math.max(0, p - 1)); }}
                        disabled={page === 0}
                        className="text-[10px] font-bold text-blue-600 disabled:opacity-30"
                    >← Anterior</button>
                    <span className="text-[10px] text-slate-400">{page + 1} / {totalPages}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); setPage(p => Math.min(totalPages - 1, p + 1)); }}
                        disabled={page === totalPages - 1}
                        className="text-[10px] font-bold text-blue-600 disabled:opacity-30"
                    >Siguiente →</button>
                </div>
            )}
        </div>
    );
};

export const AdminReviewsPage: React.FC = () => {
    const { allListings, isLoading, error } = useAdminDashboard();

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
                headers={['Publicación', 'Estado', 'Puntaje', 'Reseñas']}
                emptyMessage="No hay publicaciones registradas."
                renderRow={(listing) => {
                    const statusColors: Record<string, string> = {
                        active: 'bg-blue-50 text-blue-700 border-blue-100',
                        reserved: 'bg-purple-50 text-purple-700 border-purple-100',
                        sold: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        paused: 'bg-amber-50 text-amber-700 border-amber-100',
                    };
                    const badgeClass = statusColors[listing.status] || 'bg-slate-50 text-slate-700 border-slate-100';

                    return (
                        <tr key={listing.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
                            <td className="px-6 py-4 align-top">
                                <span className="font-mono text-xs text-slate-400">#{listing.id}</span>
                                <p className="font-semibold text-sm text-slate-900 mt-1">{listing.property?.address || 'Sin dirección'}</p>
                                <p className="text-xs text-slate-500">{listing.real_estate?.name || 'Sin inmobiliaria'}</p>
                            </td>
                            <td className="px-6 py-4 align-top">
                                <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold border ${badgeClass}`}>
                                    {STATUS_LABELS[listing.status] || listing.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                                {listing.average_rating ? (
                                    <span className="flex items-center gap-1 font-bold text-amber-500">
                                        ★ {listing.average_rating.toFixed(1)}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Sin calificar</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {listing.reviews && listing.reviews.length > 0 ? (
                                    <details className="group">
                                        <summary className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 list-none flex items-center gap-1">
                                            Ver {listing.reviews.length} observación(es)
                                            <span className="transition group-open:rotate-180">▼</span>
                                        </summary>
                                        <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                            <ReviewPagination reviews={listing.reviews} />
                                        </div>
                                    </details>
                                ) : (
                                    <span className="text-xs text-slate-400">Sin reseñas</span>
                                )}
                            </td>
                        </tr>
                    );
                }}
            />
        </div>
    );
};