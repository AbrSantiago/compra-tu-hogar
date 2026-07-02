import React from 'react';
import { FloatingInput, SubmitButton } from '@/components/form';
import type { ListingStatus, ListingResponse } from '@/types/listing';

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingResponse | null;
  price: string;
  setPrice: (price: string) => void;
  status: ListingStatus;
  setStatus: (status: ListingStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({
  isOpen,
  onClose,
  listing,
  price,
  setPrice,
  status,
  setStatus,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">Editar Publicación</h3>
            <p className="text-sm text-slate-500 mt-0.5">Modificá los valores de la publicación</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <FloatingInput
            type="number"
            name="price"
            label="Precio (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
              Estado de la publicación
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer font-medium"
              required
            >
              <option value="active">Activo</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
              <option value="paused">Pausado</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <div className="flex-1">
              <SubmitButton
                isLoading={isSubmitting}
                text="Guardar Cambios"
                loadingText="Guardando"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};