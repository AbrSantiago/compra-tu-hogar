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