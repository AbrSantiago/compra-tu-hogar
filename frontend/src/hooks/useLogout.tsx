import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('type');
    localStorage.removeItem('userId');    
    navigate('/');
  };

  return { handleLogout };
};