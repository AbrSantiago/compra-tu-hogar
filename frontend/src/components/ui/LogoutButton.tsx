import { Link } from 'react-router-dom';

type LogoutButtonProps = {
  onLogout: () => void;
};

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <Link
      to="/login"
      onClick={onLogout}
      className="w-full mt-auto py-3 bg-red-50 hover:bg-red-100 active:scale-[0.99] cursor-pointer text-red-600 font-semibold text-sm rounded-xl transition-all duration-150 text-center block"
    >
      Cerrar Sesión
    </Link>
  );
};