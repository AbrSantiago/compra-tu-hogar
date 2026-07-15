import React from 'react';
import type { ReviewResponse } from '@/types/review';

export const ReviewPagination = ({ reviews }: { reviews: ReviewResponse[] }) => {
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
                    <p className="text-xs text-slate-600">{rev.comment}</p>
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