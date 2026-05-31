import React from 'react';
import { Link } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to = "/", text = "Volver al inicio" }) => {
  return (
    <div className="mb-6">
      <Link 
        to={to} 
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        {text}
      </Link>
    </div>
  );
};