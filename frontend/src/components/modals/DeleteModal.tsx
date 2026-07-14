import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen, onClose, title, description, onConfirm, isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex space-x-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isSubmitting} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700">{isSubmitting ? "Eliminando..." : "Confirmar"}</button>
        </div>
      </div>
    </div>
  );
};