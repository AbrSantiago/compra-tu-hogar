import React, { useState } from 'react';
import type { ListingFilters } from '@/types';

interface SearchBarProps {
  onSearch: (filters: ListingFilters) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState<
    '' | 'house' | 'apartment'
  >('');

  const handleSearch = () => {
    onSearch({
      location: location || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      propertyType: propertyType || undefined,
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-full shadow-xs hover:shadow-md transition-shadow duration-150 p-2 flex items-center divide-x divide-slate-100">

      <div className="flex-1 px-6 py-2">
        <span className="block text-xs font-bold text-slate-900 tracking-wide uppercase">
          Dónde
        </span>
        <input
          type="text"
          placeholder="Buscar ciudades o zonas"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full text-sm text-slate-600 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
        />
      </div>

      <div className="w-36 px-4 py-2">
        <span className="block text-xs font-bold text-slate-900 tracking-wide uppercase">
          Desde
        </span>
        <input
          type="number"
          placeholder="$0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="block w-full text-sm text-slate-600 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
        />
      </div>

      <div className="w-36 px-4 py-2">
        <span className="block text-xs font-bold text-slate-900 tracking-wide uppercase">
          Hasta
        </span>
        <input
          type="number"
          placeholder="Sin límite"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="block w-full text-sm text-slate-600 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
        />
      </div>

      <div className="w-44 px-4 py-2">
        <span className="block text-xs font-bold text-slate-900 tracking-wide uppercase">
          Tipo
        </span>
        <select
          value={propertyType}
          onChange={(e) =>
            setPropertyType(e.target.value as '' | 'house' | 'apartment')
          }
          className="block w-full text-sm text-slate-600 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none cursor-pointer"
        >
          <option value="">Todos</option>
          <option value="house">Casa</option>
          <option value="apartment">Departamento</option>
        </select>
      </div>

      <div className="pr-2 pl-4">
        <button
          type="button"
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 stroke-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};