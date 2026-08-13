import { Property } from "@/types/property";

export const properties: Property[] = [
  {
    id: "modern-hillside-villa",
    title: "Modern Hillside Villa",
    location: "Ibex Hill, Lusaka",

    type: "Villa",
    listingType: "For Sale",

    price: 485000,
    currency: "USD",

    bedrooms: 4,
    bathrooms: 3,
    area: 420,

    yearBuilt: 2024,

    description:
      "A beautifully designed contemporary villa combining generous living spaces, modern architecture and panoramic views.",

    images: [
      "/properties/villa-1.jpg",
      "/properties/villa-2.jpg",
      "/properties/villa-3.jpg",
    ],

    features: [
      "Swimming Pool",
      "Smart Home",
      "Solar System",
      "Security",
      "Garden",
      "Double Garage",
    ],

    featured: true,
  },

  {
    id: "emerald-apartment",
    title: "Emerald City Apartment",
    location: "Roma, Lusaka",

    type: "Apartment",
    listingType: "For Sale",

    price: 225000,
    currency: "USD",

    bedrooms: 3,
    bathrooms: 2,
    area: 185,

    yearBuilt: 2023,

    description:
      "An elegant three-bedroom apartment offering contemporary interiors and convenient city living.",

    images: [
      "/properties/apartment-1.jpg",
      "/properties/apartment-2.jpg",
    ],

    features: [
      "Gym",
      "Swimming Pool",
      "24/7 Security",
      "Parking",
      "Balcony",
    ],

    featured: true,
  },
];