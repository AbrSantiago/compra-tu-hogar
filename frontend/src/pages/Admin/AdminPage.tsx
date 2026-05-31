import React from 'react';
import { AdminClientsPage } from './AdminClientsPage';
const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto font-semibold text-blue-600 text-lg">
          Compra Tu Hogar — Panel Admin
        </div>
      </nav>

      <main>
        <AdminClientsPage />
      </main>
    </div>
  );
};

export default Admin;