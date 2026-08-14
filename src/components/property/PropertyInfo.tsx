import {
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  Home,
  Ruler,
} from "lucide-react";

import { Property } from "@/types/property";

interface PropertyInfoProps {
  property: Property;
}

export function PropertyInfo({
  property,
}: PropertyInfoProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white">
          {property.listingType}
        </span>

        <span className="rounded-full bg-black/5 px-4 py-2 text-xs">
          {property.type}
        </span>
      </div>

      <h1 className="font-display mt-6 text-4xl leading-[0.92] sm:text-5xl md:text-7xl">
        {property.title}
      </h1>

      <p className="mt-5 text-sm text-[var(--muted)]">
        {property.location}
      </p>

      <div className="mt-8">
        <span className="text-3xl font-semibold">
          {property.currency === "USD" && "$"}
          {property.price.toLocaleString()}
        </span>

        {property.listingType === "For Rent" && (
          <span className="ml-1 text-sm text-[var(--muted)]">
            / month
          </span>
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 border-y border-black/10 py-6 sm:grid-cols-3">
        <Feature
          icon={<BedDouble size={19} />}
          label="Bedrooms"
          value={
            property.bedrooms > 0
              ? String(property.bedrooms)
              : "—"
          }
        />

        <Feature
          icon={<Bath size={19} />}
          label="Bathrooms"
          value={String(property.bathrooms)}
        />

        <Feature
          icon={<Ruler size={19} />}
          label="Area"
          value={`${property.area} m²`}
        />

        <Feature
          icon={<Home size={19} />}
          label="Property type"
          value={property.type}
        />

        <Feature
          icon={<CalendarDays size={19} />}
          label="Year built"
          value={property.yearBuilt?.toString() ?? "—"}
        />

        <Feature
          icon={<Car size={19} />}
          label="Parking"
          value="Available"
        />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-3xl">
          About this property
        </h2>

        <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)]">
          {property.description}
        </p>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-3xl">
          Property features
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          {property.features.map((feature) => (
            <div
              key={feature}
              className="border-b border-black/10 pb-3 text-sm"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-4 sm:py-0">
      <div className="text-black/50">{icon}</div>

      <div>
        <p className="text-xs text-[var(--muted)]">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}