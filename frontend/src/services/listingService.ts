import apiClient from './apiClient';
import type { ListingResponse, ListingCreate } from '../types/listing';

export const listingService = {
  getAll: async (): Promise<ListingResponse[]> => {
    const response = await apiClient.get<ListingResponse[]>('/listings/');
    return response.data;
  },

  getById: async (id: number): Promise<ListingResponse> => {
    const response = await apiClient.get<ListingResponse>(`/listings/${id}`);
    return response.data;
  },

  create: async (listingData: ListingCreate): Promise<ListingResponse> => {
    const response = await apiClient.post<ListingResponse>('/listings/', listingData);
    return response.data;
  },

  update: async (id: number, listingData: Partial<ListingCreate> & { status?: string }): Promise<ListingResponse> => {
    const response = await apiClient.put<ListingResponse>(`/listings/${id}`, listingData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/listings/${id}`);
  },

  purchase: async (id: number): Promise<ListingResponse> => {
    const response = await apiClient.post<ListingResponse>(`/listings/${id}/purchase`);
    return response.data;
  },

  addReview: async (id: number, reviewData: { rating: number; comment: string }): Promise<any> => {
    const response = await apiClient.post(`/listings/${id}/reviews`, reviewData);
    return response.data;
  }
};