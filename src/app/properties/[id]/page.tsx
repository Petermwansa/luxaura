import { notFound } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Container } from "@/components/ui/Container";

import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyInfo } from "@/components/property/PropertyInfo";
import { EnquiryCard } from "@/components/property/EnquiryCard";
import { RelatedProperties } from "@/components/property/RelatedProperties";
import { AgentCard } from "@/components/property/AgentCard";

import { prisma } from "@/lib/prisma";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const properties = await prisma.property.findMany({
    select: {
      slug: true,
    },
  });

  return properties.map((property) => ({
    id: property.slug,
  }));
}

export default async function PropertyPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: {
      slug: id,
    },
    include: {
      agent: true,
    },
  });

  if (!property) {
    notFound();
  }

  const transformedProperty = {
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

  return (
    <>
      <Navbar />

      <main className="bg-[#f7f6f2] pt-28 md:pt-32">
        <Container>
          <PropertyGallery
            images={transformedProperty.images}
            title={transformedProperty.title}
          />

          <div className="grid gap-12 py-12 md:gap-16 md:py-20 lg:grid-cols-[1fr_380px] lg:gap-20 lg:py-24">
            <PropertyInfo property={transformedProperty} />

            {transformedProperty.agent && (
              <div className="mt-12">
                <AgentCard
                  agent={transformedProperty.agent}
                />
              </div>
            )}

            <div className="lg:sticky lg:top-28 lg:self-start">
              <EnquiryCard
                propertyId={transformedProperty.id}
                propertyTitle={transformedProperty.title}
              />
            </div>
          </div>
        </Container>

        <RelatedProperties
          currentPropertyId={transformedProperty.id}
        />
      </main>
      <Footer />
    </>
  );
}