import React from 'react';

export const SearchBar: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-full shadow-xs hover:shadow-md transition-shadow duration-150 p-2 flex items-center divide-x divide-slate-100">
      
      <button className="flex-1 text-left px-6 py-2 cursor-pointer focus:outline-none group">
        <span className="block text-xs font-bold text-slate-900 tracking-wide uppercase">Dónde</span>
        <input 
          type="text" 
          placeholder="Buscar ciudades o zonas" 
          className="block w-full text-sm text-slate-600 bg-transparent placeholder-slate-400 border-0 p-0 focus:ring-0 focus:outline-none"
        />
      </button>

      <button className="flex-1 text-left px-6 py-2 cursor-pointer focus:outline-none">
        <span className="block text-xs font-bold text-slate-900 tracking-wide uppercase">Presupuesto</span>
        <input 
          type="text" 
          placeholder="Cualquier precio" 
          className="block w-full text-sm text-slate-600 bg-transparent placeholder-slate-400 border-0 p-0 focus:ring-0 focus:outline-none"
        />
      </button>

      <button className="flex-1 text-left px-6 py-2 cursor-pointer focus:outline-none">
        <span className="block text-xs font-bold text-slate-900 tracking-wide uppercase">Tipo</span>
        <input 
          type="text" 
          placeholder="Casa, departamento, etc" 
          className="block w-full text-sm text-slate-600 bg-transparent placeholder-slate-400 border-0 p-0 focus:ring-0 focus:outline-none"
        />
      </button>

      <div className="pr-2 pl-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

    </div>
  );
};