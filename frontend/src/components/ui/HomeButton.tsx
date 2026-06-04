import { Link } from 'react-router-dom';

export const HomeButton = () => {
  return (
    <Link
      to="/"
      className="w-full mt-auto py-3 bg-slate-50 hover:bg-slate-100 active:scale-[0.99] cursor-pointer text-slate-700 font-semibold text-sm rounded-xl transition-all duration-150 text-center block"
    >
      Volver al Inicio
    </Link>
  );
};