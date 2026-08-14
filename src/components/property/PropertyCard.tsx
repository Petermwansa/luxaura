"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Ruler,
} from "lucide-react";
import { motion } from "motion/react";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({
  property,
}: PropertyCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/properties/${property.id}`}
        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-medium">
              {property.listingType}
            </span>

            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white"
              aria-label="Save property"
            >
              <Heart size={17} />
            </button>
          </div>

          <div className="absolute bottom-5 right-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl leading-none">
                {property.title}
              </h2>

              <div className="mt-2 flex items-center gap-1 text-sm text-[var(--muted)]">
                <MapPin size={14} />
                {property.location}
              </div>
            </div>

            <p className="whitespace-nowrap text-sm font-semibold">
              {property.currency === "USD" && "$"}
              {property.price.toLocaleString()}
              {property.listingType === "For Rent" && (
                <span className="font-normal text-[var(--muted)]">
                  /mo
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-5 border-t border-black/10 pt-4 text-xs text-[var(--muted)]">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={15} />
                {property.bedrooms} Beds
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <Bath size={15} />
              {property.bathrooms} Baths
            </span>

            <span className="flex items-center gap-1.5">
              <Ruler size={15} />
              {property.area} m²
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
