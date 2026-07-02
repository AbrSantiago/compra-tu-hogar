import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AxiosError } from 'axios';

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

      if (currentUser) {
        if (currentUser.type) {
          localStorage.setItem('type', currentUser.type);
        }
        if (currentUser.id) {
          localStorage.setItem('userId', currentUser.id.toString());
        }
      }

      switch (currentUser.type) {
        case 'admin':
          navigate('/admin');
          break;
        case 'real_estate':
          navigate('/real-estate');
          break;
        case 'client':
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } catch (error: unknown) {
      console.error("Error en el proceso de login:", error);
      
      localStorage.removeItem('type');
      localStorage.removeItem('userId');
      
      const err = error as AxiosError<{ friendlyMessage?: string }>;
      const friendlyMsg = err.response?.data?.friendlyMessage;
      
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