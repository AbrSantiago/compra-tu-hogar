export interface RealEstateCreate {
  name: string;
  email: string;
  password: string;
}

export interface RealEstateUpdate {
  name?: string;
  email?: string;
  password?: string;
}

export interface RealEstateResponse {
  id: number;
  name: string;
  email: string;
  type: string;
}