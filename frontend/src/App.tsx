import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import RealEstate from './pages/RealEstate';
import Client from './pages/Client';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

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
}

export default App;