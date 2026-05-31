import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login/LoginPage';
import Register from '../pages/Register/RegisterPage';
import Admin from '../pages/Admin/AdminPage';
import RealEstate from '../pages/RealEstate';
import Client from '../pages/Client';

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
            <ProtectedRoute allowedRoles={['Admin']}>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/realestate" 
          element={
            <ProtectedRoute allowedRoles={['Real Estate']}>
              <RealEstate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/client" 
          element={
            <ProtectedRoute allowedRoles={['Client']}>
              <Client />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};