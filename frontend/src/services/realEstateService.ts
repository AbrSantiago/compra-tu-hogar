import apiClient from './apiClient';
import type { RealEstateCreate, RealEstateResponse, RealEstateUpdate } from '../types/realEstate';
import type { ListingResponse } from '../types/listing'; 
import type { ClientResponse } from '../types/client';

export const realEstateService = {
  getAll: async (): Promise<RealEstateResponse[]> => {
    const response = await apiClient.get<RealEstateResponse[]>('/real-estates');
    return response.data;
  },

  create: async (data: RealEstateCreate): Promise<RealEstateResponse> => {
    const response = await apiClient.post<RealEstateResponse>('/real-estates', data);
    return response.data;
  },

  getSales: async (realEstateId: number): Promise<ListingResponse[]> => {
    const response = await apiClient.get<ListingResponse[]>(`/real-estates/${realEstateId}/sales`);
    return response.data;
  },

  getClients: async (realEstateId: number): Promise<ClientResponse[]> => {
    const response = await apiClient.get<ClientResponse[]>(`/real-estates/${realEstateId}/clients`);
    return response.data;
  },

  getById: async (id: number): Promise<RealEstateResponse> => {
    const response = await apiClient.get<RealEstateResponse>(`/real-estates/${id}`);
    return response.data;
  },

  update: async (id: number, data: RealEstateUpdate): Promise<RealEstateResponse> => {
    const response = await apiClient.put<RealEstateResponse>(`/real-estates/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/real-estates/${id}`);
    return response.data;
  },
};