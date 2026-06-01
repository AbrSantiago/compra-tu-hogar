export interface LoginRequest {
  email: string; 
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export type UserRole = 'client' | 'real_estate' | 'admin';

export interface UserMeResponse {
  id: number;
  name: string;
  email: string;
  type: UserRole;
}