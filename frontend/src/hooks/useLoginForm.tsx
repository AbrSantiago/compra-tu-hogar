import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const useLoginForm = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      console.log("1. Intentando loginUser con:", email);
      await loginUser({ email, password });

      console.log("2. Pidiendo /auth/me...");
      const currentUser = await authService.getMe();
      
      console.log("3. Datos reales que devuelve el backend:", currentUser); // <-- CLAVE

      switch (currentUser.type) {
        case 'admin':
          console.log("-> Redirigiendo a /admin");
          navigate('/admin');
          break;
        case 'real_estate':
          navigate('/real-estate');
          break;
        case 'client':
          navigate('/client');
          break;
        default:
          console.log("-> Cayó en el default, mandando al Home. Tipo:", currentUser.type);
          navigate('/');
      }
    } catch (error: any) {
      console.error("Error en el proceso de login:", error);
      const backendMessage = error.response?.data?.detail;
      setErrorMsg(backendMessage || 'Credenciales inválidas. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    errorMsg,
  };
};