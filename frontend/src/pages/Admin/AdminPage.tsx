import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <aside className="w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shadow-xs shrink-0">
        <div>
          <div className="mb-6 border-b border-slate-100 pb-4">
            <span className="text-xl font-extrabold text-blue-600 block">
              Compra Tu Hogar
            </span>
            <p className="text-xs text-slate-400 font-medium mt-1">Panel de Administración</p>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              to="/admin/clients"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.99] cursor-pointer ${isActive('/admin/clients')
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              Listar Clientes
            </Link>

            <Link
              to="/admin/real-estate"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.99] cursor-pointer ${isActive('/admin/real-estate')
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              Gestión Inmobiliarias
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-auto py-3 bg-red-50 hover:bg-red-100 active:scale-[0.99] cursor-pointer text-red-600 font-semibold text-sm rounded-xl transition-all duration-150 text-center"
        >
          Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xs min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>

    </div>
  );
}