import type { ReviewResponse } from '@/types/review';

export type PropertyType = "house" | "apartment";

export interface PropertyCreate {
  property_id: string;
  address: string;
  location: string;
  type: PropertyType;
  characteristics: string | null;
}

export interface PropertyResponse {
  id: number;
  property_id: string;
  address: string;
  location: string;
  type: PropertyType;
  characteristics: string | null;
}

export interface PropertyDetails {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  type: string;
  realEstateName: string;
  characteristics: string | null;
  averageRating?: number | null;
  reviews: ReviewResponse[];
}

export interface PropertyUpdate {
  address?: string;
  location?: string;
  type?: PropertyType;
  characteristics?: string | null;
}