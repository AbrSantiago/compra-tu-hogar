export type UserRole = 'client' | 'real_estate' | 'admin';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserMeResponse {
  id: number;
  name: string;
  email: string;
  type: UserRole;
}