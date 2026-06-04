import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return { handleLogout };
};