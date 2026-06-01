import apiClient from './apiClient';
import type { UserMeResponse } from '../types/auth';
import type { ClientUpdate } from '../types/client';

export const clientService = {
  getAll: async (): Promise<UserMeResponse[]> => {
    const response = await apiClient.get<UserMeResponse[]>('/clients');
    return response.data;
  },

  getById: async (id: number): Promise<UserMeResponse> => {
    const response = await apiClient.get<UserMeResponse>(`/clients/${id}`);
    return response.data;
  },

  update: async (id: number, data: ClientUpdate): Promise<UserMeResponse> => {
    const response = await apiClient.put<UserMeResponse>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/clients/${id}`);
    return response.data;
  },
};