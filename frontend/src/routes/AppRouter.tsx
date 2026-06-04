import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login/LoginPage';
import { Register } from '@/pages/Register/RegisterPage';
import Admin from '@/pages/Admin/AdminPage';
import { AdminClientsPage } from '@/pages/Admin/AdminClientsPage';
import { AdminRealEstatePage } from '@/pages/Admin/AdminRealEstatePage';
import { RealEstatePropertiesPage } from '@/pages/RealEstate/RealEstatePropertiesPage';
import { RealEstateListingsPage } from '@/pages/RealEstate/RealEstateListingsPage';
import RealEstatePage from '@/pages/RealEstate/RealEstatePage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element = {
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <div className="text-center py-12 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">¡Bienvenido, Administrador! 👋🏻</h1>
              <p className="text-sm text-slate-500">Seleccioná una opción para empezar a gestionar.</p>
            </div>
          } />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="real-estate" element={<AdminRealEstatePage />} />
        </Route>

        <Route
          path="/real-estate"
          element = {
            <ProtectedRoute allowedRoles={['real_estate']}>
              <RealEstatePage />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <div className="text-center py-12 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">¡Bienvenido al Panel Inmobiliario! 🏢</h1>
              <p className="text-sm text-slate-500">Gestioná tus inmobiliarias o publicá nuevas ofertas.</p>
            </div>
          } />
          <Route path="properties" element={<RealEstatePropertiesPage />} />
          <Route path="listings" element={<RealEstateListingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};