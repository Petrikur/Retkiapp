export interface Place {
  _id?: string;
  name: string;
  position: [number, number];
  description?: string;
  category: string[];
  averageRating: number;
}

export interface PlaceFormData {
  name: string;
  description: string;
  category: string[];
  position: [number, number];
  image: File | null;
}

export interface Review {
  _id: string;
  placeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
