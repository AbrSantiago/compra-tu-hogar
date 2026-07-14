import apiClient from './apiClient';
import type { PropertyResponse, PropertyCreate, PropertyUpdate } from '../types/property';

export const propertyService = {
  getAll: async (): Promise<PropertyResponse[]> => {
    const { data } = await apiClient.get<PropertyResponse[]>('/properties/');
    return data;
  },

  create: async (propertyData: PropertyCreate): Promise<PropertyResponse> => {
    const { data } = await apiClient.post<PropertyResponse>('/properties/', propertyData);
    return data;
  },

  update: async (id: number, propertyData: PropertyUpdate): Promise<PropertyResponse> => {
    const { data } = await apiClient.put<PropertyResponse>(`/properties/${id}`, propertyData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  }
};