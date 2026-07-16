import apiClient from './apiClient';
import type { ListingResponse, ListingCreate, ListingFilters } from '../types/listing';
import type { ReviewResponse } from '@/types/review';

export const listingService = {
  getAll: async (filters?: ListingFilters): Promise<ListingResponse[]> => {
    const params = new URLSearchParams();

    if (filters?.location) {
      params.append("location", filters.location);
    }

    if (filters?.minPrice !== undefined) {
      params.append("min_price", filters.minPrice.toString());
    }

    if (filters?.maxPrice !== undefined) {
      params.append("max_price", filters.maxPrice.toString());
    }

    if (filters?.propertyType) {
      params.append("property_type", filters.propertyType);
    }

    const response = await apiClient.get<ListingResponse[]>(
      `/listings/?${params.toString()}`
    );

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

  addReview: async (id: number, reviewData: { rating: number; comment: string }): Promise<ReviewResponse> => {
    const response = await apiClient.post<ReviewResponse>(`/listings/${id}/reviews`, reviewData);
    return response.data;
  }
};