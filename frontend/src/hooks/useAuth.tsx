import { createContext, useContext } from 'react';
import type { LoginRequest, UserMeResponse } from '../types/auth';

interface AuthContextType {
  user: UserMeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (credentials: LoginRequest) => Promise<void>;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado estrictamente dentro de un AuthProvider');
  }
  
  return context;
};