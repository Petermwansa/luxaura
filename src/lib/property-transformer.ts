import type { Property } from "@/types/property";

export function transformProperty(
  property: any
): Property {
  return {
    id: property.slug,

    title: property.title,

    location: property.location,

    type:
      property.type.charAt(0) +
      property.type.slice(1).toLowerCase(),

    listingType:
      property.listingType === "SALE"
        ? "For Sale"
        : "For Rent",

    price: property.price,

    currency: property.currency,

    bedrooms: property.bedrooms,

    bathrooms: property.bathrooms,

    area: property.area,

    yearBuilt: property.yearBuilt,

    description: property.description,

    images: property.images,

    features: property.features,

    featured: property.featured,

    agent: property.agent
      ? {
          name: property.agent.name,
          role: property.agent.role,
          phone: property.agent.phone,
          email: property.agent.email,
          image: property.agent.image,
        }
      : undefined,
  };
}