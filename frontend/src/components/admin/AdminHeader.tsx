import React from 'react';

interface AdminHeaderProps {
  title: string;
  description: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description }) => {
  return (
    <div className="border-b border-slate-100 pb-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        {description}
      </p>
    </div>
  );
};