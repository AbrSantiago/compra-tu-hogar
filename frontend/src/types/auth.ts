export interface LoginRequest {
  email: string; 
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export type UserRole = 'Client' | 'Real Estate' | 'Admin';

export interface UserMeResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}