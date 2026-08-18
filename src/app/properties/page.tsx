"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, Search, SlidersHorizontal } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { PropertyCard } from "@/components/property/PropertyCard";
import {
  Filters,
  PropertyFilters,
} from "@/components/property/PropertyFilters";

import { Property } from "@/types/property";

export default function PropertiesPage() {
  const [mobileFilters, setMobileFilters] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const [sort, setSort] = useState(searchParams.get("sort") ?? "featured");

  const [filters, setFilters] = useState<Filters>({
    listingType:
      (searchParams.get("listing") as Filters["listingType"]) ?? "All",

    propertyType:
      (searchParams.get("type") as Filters["propertyType"]) ?? "All",

    minPrice: searchParams.get("minPrice") ?? "",

    maxPrice: searchParams.get("maxPrice") ?? "",

    bedrooms: searchParams.get("bedrooms") ?? "",
  });

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);

        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();

        const transformedProperties: Property[] = data.map((property: any) => ({
          id: property.id,

          slug: property.slug,

          title: property.title,

          location: property.location,

          type: property.type.charAt(0) + property.type.slice(1).toLowerCase(),

          listingType:
            property.listingType === "SALE" ? "For Sale" : "For Rent",

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

        setProperties(transformedProperties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query),
      );
    }

    if (filters.listingType !== "All") {
      result = result.filter(
        (property) => property.listingType === filters.listingType,
      );
    }

    if (filters.propertyType !== "All") {
      result = result.filter(
        (property) => property.type === filters.propertyType,
      );
    }

    if (filters.minPrice) {
      result = result.filter(
        (property) => property.price >= Number(filters.minPrice),
      );
    }

    if (filters.maxPrice) {
      result = result.filter(
        (property) => property.price <= Number(filters.maxPrice),
      );
    }

    if (filters.bedrooms) {
      const minimumBedrooms = Number(filters.bedrooms.replace("+", ""));

      result = result.filter(
        (property) => property.bedrooms >= minimumBedrooms,
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "largest") {
      result.sort((a, b) => b.area - a.area);
    }

    if (sort === "featured") {
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [properties, search, filters, sort]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (filters.listingType !== "All") {
      params.set("listing", filters.listingType);
    }

    if (filters.propertyType !== "All") {
      params.set("type", filters.propertyType);
    }

    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice);
    }

    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice);
    }

    if (filters.bedrooms) {
      params.set("bedrooms", filters.bedrooms);
    }

    if (sort !== "featured") {
      params.set("sort", sort);
    }

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.replace(newQuery ? `/properties?${newQuery}` : "/properties", {
        scroll: false,
      });
    }
  }, [search, filters, sort, router, searchParams]);

  return (
    <>
      <Navbar />

      <main>
        <section className="bg-[#111111] pb-20 pt-36 text-white md:pb-28">
          <Container>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Our collection
            </p>

            <h1 className="font-display mt-5 max-w-4xl text-6xl leading-[0.9] md:text-8xl">
              Find your
              <br />
              <i>next place.</i>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/50 md:text-base">
              Explore carefully selected properties in some of Lusaka&apos;s
              most desirable locations.
            </p>
          </Container>
        </section>

        <section className="border-b border-black/10 bg-white">
          <Container className="py-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by location or property name..."
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] pl-11 pr-4 text-sm outline-none transition focus:border-black"
                />
              </div>

              <button
                onClick={() => setMobileFilters(true)}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 px-5 text-sm md:hidden"
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>

              <div className="relative">
                <ArrowDownUp
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                />

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white pl-11 pr-10 text-sm outline-none md:w-52"
                >
                  <option value="featured">Featured</option>

                  <option value="price-low">Price: Low to high</option>

                  <option value="price-high">Price: High to low</option>

                  <option value="largest">Largest first</option>
                </select>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-[#f7f6f2] py-12 md:py-16">
          <Container>
            <div className="flex gap-12">
              <PropertyFilters
                filters={filters}
                setFilters={setFilters}
                mobileOpen={mobileFilters}
                setMobileOpen={setMobileFilters}
              />

              <div className="min-w-0 flex-1">
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-sm text-[var(--muted)]">
                    <span className="font-medium text-black">
                      {loading ? "—" : filteredProperties.length}
                    </span>{" "}
                    properties found
                  </p>
                </div>

                {loading ? (
                  <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="animate-pulse">
                        <div className="aspect-[4/3] rounded-2xl bg-black/10" />

                        <div className="mt-5 h-4 w-2/3 rounded bg-black/10" />

                        <div className="mt-3 h-4 w-1/3 rounded bg-black/10" />

                        <div className="mt-5 h-5 w-1/2 rounded bg-black/10" />
                      </div>
                    ))}
                  </div>
                ) : filteredProperties.length > 0 ? (
                  <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white text-center">
                    <div className="font-display text-4xl">
                      No properties found
                    </div>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
                      Try adjusting your search or removing some of your
                      filters.
                    </p>

                    <button
                      onClick={() => {
                        setSearch("");

                        setFilters({
                          listingType: "All",
                          propertyType: "All",
                          minPrice: "",
                          maxPrice: "",
                          bedrooms: "",
                        });
                      }}
                      className="mt-6 rounded-full bg-black px-5 py-3 text-sm text-white"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
