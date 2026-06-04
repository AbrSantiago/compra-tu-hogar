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
      await loginUser({ email, password });
      
      const currentUser = await authService.getMe();

      if (currentUser && currentUser.type) {
        localStorage.setItem('type', currentUser.type);
      }

      switch (currentUser.type) {
        case 'admin':
          navigate('/admin');
          break;
        case 'real_estate':
          navigate('/real-estate');
          break;
        case 'client':
          navigate('/client');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error("Error en el proceso de login:", error);
      
      localStorage.removeItem('type');
      
      const friendlyMsg = error.response?.data?.friendlyMessage;
      setErrorMsg(friendlyMsg || 'Usuario o contraseña incorrectos. Verificá tus credenciales.');
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