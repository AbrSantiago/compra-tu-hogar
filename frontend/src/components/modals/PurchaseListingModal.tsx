import React from 'react';

interface PurchaseListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const PurchaseListingModal: React.FC<PurchaseListingModalProps> = ({
  isOpen,
  onClose,
  title,
  price,
  onConfirm,
  isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125V18M3.75 18v.75c0 .414.336.75.75.75h.061m0 0H19.5m-15.75 0a1.5 1.5 0 0 1-1.5-1.5V6m15.75 12a1.5 1.5 0 0 0 1.5-1.5V6M6 7.5h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H12m-3 3H12m-3 3H12m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">¿Confirmar compra del inmueble?</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Estás por adquirir la propiedad ubicada en <span className="font-semibold text-slate-800">{title}</span> por un valor de <span className="font-semibold text-slate-800">USD {price.toLocaleString('es-AR')}</span>.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 border border-blue-700 rounded-xl hover:bg-blue-800 transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Procesando</span>
              </>
            ) : (
              <span>Comprar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};