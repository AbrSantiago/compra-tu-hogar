import type { ReviewResponse } from './review';

export type ListingStatus = 'active' | 'reserved' | 'sold' | 'paused';

export interface ListingRealEstate {
  id: number;
  name: string;
  email: string;
}

export interface ListingBuyer {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface ListingResponse {
  id: number;
  property_id: number;
  price: number;
  status: ListingStatus;
  property?: { 
    id: number;
    address: string;
    location: string;
    type: string;
    characteristics: string | null;
  };
  buyer?: ListingBuyer | null;
  real_estate?: ListingRealEstate;
  average_rating: number | null; 
  reviews: ReviewResponse[];
}

export interface ListingCreate {
  property_id: number;
  price: number;
  status: ListingStatus;
}

export interface ListingUpdate {
  price?: number;
  status?: ListingStatus;
}

export interface ListingFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: 'house' | 'apartment';
}