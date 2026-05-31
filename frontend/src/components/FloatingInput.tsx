import React from 'react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({ label, name, ...props }) => {
  return (
    <div className="relative border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white w-full">
      <input
        name={name}
        id={name}
        placeholder=" "
        className="peer block w-full px-4 pt-6 pb-2 text-sm bg-transparent border-0 text-slate-900 focus:outline-none focus:ring-0"
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-4 text-sm text-slate-400 font-medium origin-[0] -translate-y-3 scale-75 transform transition-all duration-150 cursor-text
                   peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                   peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
      >
        {label}
      </label>
    </div>
  );
};