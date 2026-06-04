import React from 'react';

interface AdminTableProps<T> {
  isLoading: boolean;
  data: T[];
  headers: string[];
  emptyMessage?: string;
  renderRow: (item: T) => React.ReactNode;
}

export function AdminTable<T>({
  isLoading,
  data,
  headers,
  emptyMessage = "No hay registros cargados de momento.",
  renderRow
}: AdminTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-12 bg-slate-100 rounded-xl animate-pulse w-full" />
        <div className="h-16 bg-slate-50 rounded-xl animate-pulse w-full" />
        <div className="h-16 bg-slate-50 rounded-xl animate-pulse w-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <p className="text-sm text-slate-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {headers.map((header, i) => (
                <th key={i} className="px-6 py-4">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((item) => renderRow(item))}
          </tbody>
        </table>
      </div>
    </div>
  );
}