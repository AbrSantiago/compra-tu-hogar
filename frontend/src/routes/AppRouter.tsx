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
import { ClientPurchasesPage } from '@/pages/Client/ClientPurchasesPage.tsx';
import { ClientFavoritesPage } from '@/pages/Client/ClientFavoritesPage';
import { AdminStatsPage } from '@/pages/Admin/AdminStatsPage';
import { AdminPropertiesPage } from '@/pages/Admin/AdminPropertiesPage';
import { AdminPurchasesPage } from '@/pages/Admin/AdminPurchasesPage';
import { AdminReviewsPage } from '@/pages/Admin/AdminReviewsPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/mis-propiedades"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientPurchasesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-favoritos"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientFavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <div className="flex flex-col items-center justify-center text-center min-h-[50vh] space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                ¡Bienvenido, Administrador! 👋🏻
              </h1>
              <p className="text-md text-slate-500">
                Seleccioná una opción para empezar a gestionar.
              </p>
            </div>
          } />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="real-estate" element={<AdminRealEstatePage />} />
          <Route path="properties" element={<AdminPropertiesPage />} />
          <Route path="purchases" element={<AdminPurchasesPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
        </Route>

        <Route
          path="/real-estate"
          element={
            <ProtectedRoute allowedRoles={['real_estate']}>
              <RealEstatePage />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <div className="flex flex-col items-center justify-center text-center min-h-[50vh] space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                ¡Bienvenido al Panel Inmobiliario! 👋🏻
              </h1>
              <p className="text-md text-slate-500">
                Gestioná tus inmobiliarias o publicá nuevas ofertas.
              </p>
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