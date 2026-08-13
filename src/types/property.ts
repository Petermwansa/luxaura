export type PropertyType =
  | "Apartment"
  | "Villa"
  | "House"
  | "Commercial"
  | "Land";

export type ListingType = "For Sale" | "For Rent";

export interface Property {
  id: string;

  title: string;
  location: string;

  type: PropertyType;
  listingType: ListingType;

  price: number;
  currency: string;

  bedrooms: number;
  bathrooms: number;
  area: number;

  yearBuilt?: number;

  description: string;

  images: string[];

  features: string[];

  featured?: boolean;
}