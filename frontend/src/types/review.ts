export interface ReviewResponse {
  id: number;
  client_id: number;
  listing_id: number;
  rating: number;
  comment: string | null;
  client_name: string;
}