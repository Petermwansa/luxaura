"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { properties } from "@/data/properties";

export function FeaturedProperties() {
  const featured = properties.filter(
    (property) => property.featured
  );

  return (
    <section className="py-28 md:py-36">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
              Our selection
            </p>

            <h2 className="font-display text-5xl leading-none md:text-7xl">
              Featured properties
            </h2>
          </div>

          <Link
            href="/properties"
            className="group flex items-center gap-2 text-sm"
          >
            View all properties
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
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

                  <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-medium">
                    {property.listingType}
                  </div>

                  <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white opacity-0 transition duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="mt-5 flex justify-between gap-5">
                  <div>
                    <h3 className="font-display text-3xl">
                      {property.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1 text-sm text-[var(--muted)]">
                      <MapPin size={14} />
                      {property.location}
                    </div>
                  </div>

                  <p className="text-sm font-medium">
                    ${property.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}