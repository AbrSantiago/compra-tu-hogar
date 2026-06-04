import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminNavLinkProps {
  to: string;
  children: React.ReactNode;
}

export const AdminNavLink: React.FC<AdminNavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.99] cursor-pointer ${
        isActive
          ? 'bg-blue-600 text-white shadow-xs'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {children}
    </Link>
  );
};