import type { ReviewResponse } from './review';

export type ListingStatus = 'active' | 'reserved' | 'sold' | 'paused';

export interface ListingCreate {
  property_id: number;
  price: number;
  status: ListingStatus;
}

export interface ListingProperty {
  id: number;
  address: string;
  location: string;
  type: "house" | "apartment";
  characteristics: string | null;
}

export interface ListingRealEstate {
  id: number;
  name: string;
  email: string;
}

export interface ListingResponse {
  id: number;
  property_id: number;
  price: number;
  status: ListingStatus;
  property?: ListingProperty;     
  real_estate?: ListingRealEstate;
  average_rating: number | null;
  reviews: ReviewResponse[];
}