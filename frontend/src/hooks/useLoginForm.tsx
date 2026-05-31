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

      switch (currentUser.type) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Real Estate':
          navigate('/realestate');
          break;
        case 'Client':
          navigate('/client');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
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