import React from 'react';
import { SubmitButton } from '@/components/form';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  children: React.ReactNode; 
}

export const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, onClose, title, subtitle, onSubmit, isSubmitting, children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
              Cancelar
            </button>
            <div className="flex-1">
              <SubmitButton isLoading={isSubmitting} text="Guardar Cambios" loadingText="Guardando" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};