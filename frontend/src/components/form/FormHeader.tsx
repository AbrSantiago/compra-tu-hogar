import React from 'react';

interface FormHeaderProps {
  title: React.ReactNode;
  description: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
};