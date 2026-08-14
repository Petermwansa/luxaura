import { properties } from "@/data/properties";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "./PropertyCard";

interface RelatedPropertiesProps {
  currentPropertyId: string;
}

export function RelatedProperties({
  currentPropertyId,
}: RelatedPropertiesProps) {
  const related = properties
    .filter((property) => property.id !== currentPropertyId)
    .slice(0, 3);

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