export interface Service {
  id: number;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  duration: number;
  description: string;
  image?: string;
  slots?: number;
  discount?: number;
  includes?: string[];
  isMembersOnly?: boolean;
  offerValidUntil?: string;
  rating?: number;
  reviews?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ServiceFilter {
  category?: string;
  subCategory?: string;
  priceRange?: [number, number];
  duration?: number;
  searchTerm?: string;
}
