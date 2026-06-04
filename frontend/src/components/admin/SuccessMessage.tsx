import React from 'react';

interface SuccessMessageProps {
  message: string | null;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center justify-center text-center font-medium">
      <p>{message}</p>
    </div>
  );
};