import { notFound } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Container } from "@/components/ui/Container";

import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyInfo } from "@/components/property/PropertyInfo";
import { EnquiryCard } from "@/components/property/EnquiryCard";
import { RelatedProperties } from "@/components/property/RelatedProperties";

import { properties } from "@/data/properties";
import { AgentCard } from "@/components/property/AgentCard";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }));
}

export default async function PropertyPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;

  const property = properties.find(
    (property) => property.id === id
  );

  if (!property) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="bg-[#f7f6f2] pt-28 md:pt-32">
        <Container>
          <PropertyGallery
            images={property.images}
            title={property.title}
          />

          <div className="grid gap-12 py-12 md:gap-16 md:py-20 lg:grid-cols-[1fr_380px] lg:gap-20 lg:py-24">
            <PropertyInfo property={property} />

            {property.agent && (
                <div className="mt-12">
                    <AgentCard agent={property.agent}/>
                </div>
            )}

            <div className="lg:sticky lg:top-28 lg:self-start">
              <EnquiryCard
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </Container>

        <RelatedProperties
          currentPropertyId={property.id}
        />
      </main>

      <Footer />
    </>
  );
}