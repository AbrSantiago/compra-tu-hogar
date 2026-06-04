import apiClient from './apiClient';
import type {
    LoginRequest,
    LoginResponse,
    UserMeResponse,
} from '../types/auth';
import type { ClientCreate } from '../types/client';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData: ClientCreate): Promise<any> => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMe: async (): Promise<UserMeResponse> => {
        try {
            const response = await apiClient.get<UserMeResponse>('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};