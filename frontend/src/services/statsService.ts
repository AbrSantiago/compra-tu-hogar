import apiClient from './apiClient';
import type { TopClientResponse, TopPropertyResponse, TopRealEstateResponse } from '../types/stats';

export const statsService = {
  getTopClients: async (): Promise<TopClientResponse[]> => {
    const response = await apiClient.get<TopClientResponse[]>('/stats/top-clients');
    return response.data;
  },

  getTopProperties: async (): Promise<TopPropertyResponse[]> => {
    const response = await apiClient.get<TopPropertyResponse[]>('/stats/top-properties');
    return response.data;
  },

  getTopRealEstates: async (): Promise<TopRealEstateResponse[]> => {
    const response = await apiClient.get<TopRealEstateResponse[]>('/stats/top-real-estates');
    return response.data;
  }
};