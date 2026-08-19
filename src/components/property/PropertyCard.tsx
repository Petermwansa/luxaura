"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Heart,
  Loader2,
  MapPin,
  Ruler,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({
  property,
}: PropertyCardProps) {
  const { isSignedIn } = useAuth();

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  /*
   * Check whether this property is already
   * in the user's favorites.
   */
  useEffect(() => {
    async function checkFavorite() {
      if (!isSignedIn) {
        setSaved(false);
        return;
      }

      try {
        const response = await fetch(
          "/api/favorites",
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const favorites = Array.isArray(data)
          ? data
          : data.favorites ?? [];

        const isFavorite = favorites.some(
          (favorite: {
            propertyId: string;
          }) =>
            favorite.propertyId === property.id,
        );

        setSaved(isFavorite);
      } catch (error) {
        console.error(
          "Failed to check favorite:",
          error,
        );
      }
    }

    checkFavorite();
  }, [isSignedIn, property.id]);

  /*
   * Add or remove favorite.
   */
  async function handleFavorite(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(
        window.location.pathname,
      )}`;

      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      /*
       * Remove favorite
       */
      if (saved) {
        const response = await fetch(
          `/api/favorites/${property.id}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const data = await response.json();

          throw new Error(
            data.error ||
              "Failed to remove favorite.",
          );
        }

        setSaved(false);

        /*
         * Tell the page that this favorite was removed.
         *
         * The favorites page listens for this event
         * and removes the property from its local list.
         */
        window.dispatchEvent(
          new CustomEvent("favoriteRemoved", {
            detail: {
              propertyId: property.id,
            },
          }),
        );
      } else {
        /*
         * Add favorite
         */
        const response = await fetch(
          "/api/favorites",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              propertyId: property.id,
            }),
          },
        );

        if (!response.ok) {
          const data = await response.json();

          throw new Error(
            data.error ||
              "Failed to add favorite.",
          );
        }

        setSaved(true);
      }
    } catch (error) {
      console.error(
        "Failed to update favorite:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/properties/${property.slug}`}
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

            {/* Favorite button */}
            <button
              type="button"
              onClick={handleFavorite}
              disabled={loading}
              className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition ${
                saved
                  ? "bg-black text-white"
                  : "bg-white/90 hover:bg-white"
              } ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
              aria-label={
                saved
                  ? "Remove from favorites"
                  : "Save property"
              }
            >
              {loading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Heart
                  size={17}
                  fill={
                    saved
                      ? "currentColor"
                      : "none"
                  }
                />
              )}
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
              {property.currency === "USD" &&
                "$"}

              {property.price.toLocaleString()}

              {property.listingType ===
                "For Rent" && (
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