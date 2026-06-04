export type ListingStatus = 'active' | 'reserved' | 'sold' | 'paused';

export interface ListingCreate {
  property_id: number;
  price: number;
  status: ListingStatus;
}

export interface ListingResponse {
  id: number;
  property_id: number;
  price: number;
  status: ListingStatus;
}