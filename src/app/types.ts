export interface Place {
  _id?: string;
  name: string;
  position: [number, number];
  description?: string;
  category: string[];
  averageRating: number;
  city: string;
  country: string;
  address: string;
  zip: number;
}

export interface PlaceFormData {
  name: string;
  description: string;
  category: string[];
  position: [number, number];
  image: string;
  country: string;
  address: string;
  city: string;
  zip: number;
  averageRating: number;
}

export interface Review {
  _id: string;
  placeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
