import apiClient from './apiClient';
import type { PropertyResponse, PropertyCreate } from '../types/property';

export const propertyService = {
  getAll: async (): Promise<PropertyResponse[]> => {
    const response = await apiClient.get<PropertyResponse[]>('/properties/');
    return response.data;
  },

  create: async (propertyData: PropertyCreate): Promise<PropertyResponse> => {
    const response = await apiClient.post<PropertyResponse>('/properties/', propertyData);
    return response.data;
  }
};