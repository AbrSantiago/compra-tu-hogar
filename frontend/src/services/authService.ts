import apiClient from './apiClient';
import type {
    LoginRequest,
    LoginResponse,
    UserMeResponse,
} from '../types/auth';
import type { ClientCreate } from '../types/client';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: ClientCreate): Promise<void> => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    getMe: async (): Promise<UserMeResponse> => {
        const response = await apiClient.get<UserMeResponse>('/auth/me');
        return response.data;
    },
};