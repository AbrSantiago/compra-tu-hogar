import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Home from '../pages/Home';
import { Login } from '../pages/Login/LoginPage';
import { Register } from '../pages/Register/RegisterPage';
import Admin from '../pages/Admin/AdminPage';
import RealEstate from '../pages/RealEstate';
import Client from '../pages/Client';
import { AdminClientsPage } from '@/pages/Admin/AdminClientsPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="clients" replace />} />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="real-estate" element={<div>Próximamente Inmobiliarias</div>} />
        </Route>
        <Route
          path="/realestate"
          element={
            <ProtectedRoute allowedRoles={['real_estate']}>
              <RealEstate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <Client />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};