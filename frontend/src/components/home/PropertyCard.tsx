import React from 'react';

interface PropertyCardProps {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  realEstateName: string;
  beds: number;
  baths: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  location,
  price,
  image,
  realEstateName,
  beds,
  baths
}) => {
  return (
    <div className="group cursor-pointer space-y-3 active:scale-[0.99] transition-all duration-150">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-200"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-900 rounded-xl shadow-xs border border-slate-200/50">
          {realEstateName}
        </span>
      </div>

      <div className="space-y-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-slate-900 text-sm tracking-tight line-clamp-1">
            {location}
          </h3>
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {beds} dorm · {baths} baños
          </div>
        </div>
        
        <p className="text-xs text-slate-400 font-medium line-clamp-1">
          {title}
        </p>
        
        <div className="pt-0.5">
          <span className="text-sm font-bold text-slate-900">
            USD {price.toLocaleString('es-AR')}
          </span>
        </div>
      </div>
    </div>
  );
};