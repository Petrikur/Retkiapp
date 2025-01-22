export interface Place {
  _id?: string;
  name: string;
  position: [number, number];
  description?: string;
  category: string[];
}

export interface PlaceFormData {
  name: string;
  description: string;
  category: string[];
  position: [number, number];
  image: File | null;
}
