import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, text, loadingText }) => {
  return (
    <div className="pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all ${
          isLoading
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] cursor-pointer shadow-xs'
        }`}
      >
        {isLoading ? loadingText : text}
      </button>
    </div>
  );
};