import { Outlet, useNavigate } from 'react-router-dom';
import { AdminNavLink } from '@/components/admin';
import { HomeButton, LogoutButton } from '@/components/ui';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('type');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <aside className="w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shadow-xs shrink-0 sticky top-0 h-screen">
        <div>
          <div className="mb-6 border-b border-slate-100 pb-4">
            <span className="text-xl font-extrabold text-blue-600 block">Compra Tu Hogar</span>
            <p className="text-xs text-slate-400 font-medium mt-1">Panel de Administración</p>
          </div>

          <nav className="flex flex-col gap-2">
            <AdminNavLink to="/admin/clients">Listar Clientes</AdminNavLink>
            <AdminNavLink to="/admin/real-estate">Gestionar Inmobiliarias</AdminNavLink>
          </nav>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <HomeButton />
          <LogoutButton onLogout={handleLogout} />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xs min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}