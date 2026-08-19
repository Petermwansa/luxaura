"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "@/components/property/PropertyCard";

import { Property } from "@/types/property";

interface FavoriteResponse {
  id: string;
  userId: string;
  propertyId: string;

  property: {
    id: string;
    slug: string;
    title: string;
    location: string;

    type: string;
    listingType: "SALE" | "RENT";

    price: number;
    currency: string;

    bedrooms: number;
    bathrooms: number;
    area: number;

    yearBuilt: number | null;

    description: string;

    images: string[];
    features: string[];

    featured: boolean;

    agent?: {
      name: string;
      role: string;
      phone: string;
      email: string;
      image: string | null;
    } | null;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /*
   * Fetch the user's favorites
   */
  useEffect(() => {
    async function fetchFavorites() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/favorites",
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch favorites",
          );
        }

        const data: FavoriteResponse[] =
          await response.json();

        const transformedProperties: Property[] =
          data.map((favorite) => {
            const property = favorite.property;

            return {
              id: property.id,

              slug: property.slug,

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
          });

        setFavorites(transformedProperties);
      } catch (error) {
        console.error(
          "Failed to fetch favorites:",
          error,
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  /*
   * Listen for a favorite being removed
   *
   * PropertyCard dispatches this event after
   * successfully deleting the favorite from
   * the database.
   */
  useEffect(() => {
    function handleFavoriteRemoved(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          propertyId: string;
        }>;

      const removedPropertyId =
        customEvent.detail.propertyId;

      setFavorites((current) =>
        current.filter(
          (property) =>
            property.id !== removedPropertyId,
        ),
      );
    }

    window.addEventListener(
      "favoriteRemoved",
      handleFavoriteRemoved,
    );

    return () => {
      window.removeEventListener(
        "favoriteRemoved",
        handleFavoriteRemoved,
      );
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f6f2] pt-28 md:pt-32">
        <Container>
          {/* Header */}
          <div className="pb-12 md:pb-16">
            <Link
              href="/account"
              className="mb-8 inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
            >
              <ArrowLeft size={16} />

              Back to account
            </Link>

            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                  Your collection
                </p>

                <h1 className="font-display mt-4 text-5xl tracking-tight md:text-7xl">
                  Saved properties
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/50 md:text-base">
                  Properties you've saved for
                  later. Keep track of the homes
                  that caught your eye.
                </p>
              </div>

              {!loading && !error && (
                <div className="hidden items-center gap-2 text-sm text-black/40 md:flex">
                  <Heart size={16} />

                  {favorites.length}{" "}
                  {favorites.length === 1
                    ? "property"
                    : "properties"}
                </div>
              )}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid gap-x-6 gap-y-12 pb-20 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse"
                >
                  <div className="aspect-[4/3] rounded-2xl bg-black/10" />

                  <div className="mt-5 h-5 w-2/3 rounded bg-black/10" />

                  <div className="mt-3 h-4 w-1/3 rounded bg-black/10" />

                  <div className="mt-5 h-4 w-1/2 rounded bg-black/10" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                <Heart size={22} />
              </div>

              <h2 className="font-display mt-6 text-3xl">
                Something went wrong
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
                We couldn't load your saved
                properties. Please try again.
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
                className="mt-7 rounded-full bg-black px-6 py-3 text-sm text-white transition hover:bg-black/80"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading &&
            !error &&
            favorites.length === 0 && (
              <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f6f2]">
                  <Heart
                    size={24}
                    className="text-black/50"
                  />
                </div>

                <h2 className="font-display mt-7 text-4xl">
                  No saved properties
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
                  When you find a property you
                  love, tap the heart icon to save
                  it here.
                </p>

                <Link
                  href="/properties"
                  className="mt-7 rounded-full bg-black px-6 py-3 text-sm text-white transition hover:bg-black/80"
                >
                  Explore properties
                </Link>
              </div>
            )}

          {/* Favorites grid */}
          {!loading &&
            !error &&
            favorites.length > 0 && (
              <div className="grid gap-x-6 gap-y-12 pb-20 md:grid-cols-2">
                {favorites.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            )}
        </Container>
      </main>

      <Footer />
    </>
  );
}