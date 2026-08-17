import { prisma } from "@/lib/prisma";

import { Container } from "@/components/ui/Container";
import { PropertyCard } from "./PropertyCard";

interface RelatedPropertiesProps {
  currentPropertyId: string;
}

export async function RelatedProperties({
  currentPropertyId,
}: RelatedPropertiesProps) {
  const currentProperty = await prisma.property.findUnique({
    where: {
      slug: currentPropertyId,
    },
    select: {
      id: true,
      type: true,
      location: true,
    },
  });

  if (!currentProperty) {
    return null;
  }

  const relatedProperties = await prisma.property.findMany({
    where: {
      id: {
        not: currentProperty.id,
      },

      OR: [
        {
          type: currentProperty.type,
        },
        {
          location: currentProperty.location,
        },
      ],
    },

    include: {
      agent: true,
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: 3,
  });

  const related = relatedProperties.map((property) => ({
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
  }));

  return (
    <section className="border-t border-black/10 py-24 md:py-32">
      <Container>
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
            You may also like
          </p>

          <h2 className="font-display mt-4 text-5xl">
            Similar properties
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {related.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}