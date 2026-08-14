import { Property } from "@/types/property";


const agents = {
  amanda: {
    name: "Amanda Mwila",
    role: "Senior Property Consultant",
    phone: "+260 97 000 0000",
    email: "amanda@luxora.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },

  michael: {
    name: "Michael Banda",
    role: "Luxury Property Specialist",
    phone: "+260 96 000 0000",
    email: "michael@luxora.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
};

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
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
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
    agent: agents.amanda,
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
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    ],
    features: [
      "Gym",
      "Swimming Pool",
      "24/7 Security",
      "Parking",
      "Balcony",
    ],
    featured: true,
    agent: agents.michael,
  },

  {
    id: "woodland-residence",
    title: "Woodland Residence",
    location: "Woodlands, Lusaka",
    type: "House",
    listingType: "For Sale",
    price: 375000,
    currency: "USD",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    yearBuilt: 2022,
    description:
      "A sophisticated family residence surrounded by mature trees and beautifully landscaped gardens.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    ],
    features: [
      "Garden",
      "Garage",
      "Security",
      "Staff Quarters",
      "Entertainment Area",
    ],
    agent: agents.amanda,
  },

  {
    id: "city-penthouse",
    title: "The City Penthouse",
    location: "Longacres, Lusaka",
    type: "Apartment",
    listingType: "For Rent",
    price: 3500,
    currency: "USD",
    bedrooms: 3,
    bathrooms: 3,
    area: 240,
    yearBuilt: 2025,
    description:
      "A stunning penthouse with expansive city views, premium finishes and exceptional amenities.",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
    features: [
      "Rooftop",
      "Gym",
      "Pool",
      "Concierge",
      "Parking",
    ],
    agent: agents.michael,
  },

  {
    id: "lakeview-estate",
    title: "Lakeview Estate",
    location: "Leopards Hill, Lusaka",
    type: "House",
    listingType: "For Sale",
    price: 690000,
    currency: "USD",
    bedrooms: 5,
    bathrooms: 4,
    area: 580,
    yearBuilt: 2021,
    description:
      "An expansive luxury residence designed for entertaining, privacy and effortless indoor-outdoor living.",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    ],
    features: [
      "Swimming Pool",
      "Guest House",
      "Garden",
      "Home Office",
      "Security",
      "Double Garage",
    ],
    agent: agents.amanda,
  },

  {
    id: "central-office",
    title: "Central Business Office",
    location: "Central Business District, Lusaka",
    type: "Commercial",
    listingType: "For Rent",
    price: 6500,
    currency: "USD",
    bedrooms: 0,
    bathrooms: 2,
    area: 460,
    yearBuilt: 2020,
    description:
      "A premium commercial space located in the heart of Lusaka's business district.",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
    ],
    features: [
      "Reception",
      "Meeting Rooms",
      "Parking",
      "Security",
      "Backup Power",
    ],
    agent: agents.michael,
  },
];