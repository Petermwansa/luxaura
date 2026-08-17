"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronRight,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  listingType: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  featured: boolean;
  agent?: {
    id: string;
    name: string;
  } | null;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchProperties() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/properties");

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();

      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  async function deleteProperty(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/admin/properties/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete property",
        );
      }

      setProperties((current) =>
        current.filter((property) => property.id !== id),
      );
    } catch (error) {
      console.error("Delete property error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete property.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function formatPrice(
    price: number,
    currency: string,
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        {/* Header */}

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/40">
              <span>Admin</span>

              <ChevronRight size={13} />

              <span>Properties</span>
            </div>

            <h1 className="font-display text-5xl tracking-tight md:text-6xl">
              Properties
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              Manage your property listings, pricing,
              agents and featured properties.
            </p>
          </div>

          <Link
            href="/admin/properties/new"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/80"
          >
            <Plus size={17} />

            Add property
          </Link>
        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total properties"
            value={loading ? "—" : properties.length}
            icon={<Building2 size={18} />}
          />

          <StatCard
            label="For sale"
            value={
              loading
                ? "—"
                : properties.filter(
                    (property) =>
                      property.listingType === "SALE",
                  ).length
            }
          />

          <StatCard
            label="For rent"
            value={
              loading
                ? "—"
                : properties.filter(
                    (property) =>
                      property.listingType === "RENT",
                  ).length
            }
          />

          <StatCard
            label="Featured"
            value={
              loading
                ? "—"
                : properties.filter(
                    (property) => property.featured,
                  ).length
            }
            icon={<Star size={18} />}
          />
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="hidden border-b border-black/10 px-6 py-4 text-xs uppercase tracking-wider text-black/40 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_100px] lg:gap-6">
            <span>Property</span>
            <span>Type</span>
            <span>Price</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {loading ? (
            <LoadingRows />
          ) : properties.length === 0 ? (
            <EmptyState />
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className="border-b border-black/10 p-5 last:border-0 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_100px] lg:items-center lg:gap-6 lg:px-6"
              >
                {/* Property */}

                <div className="flex gap-4">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-black/5">
                    {property.images?.[0] ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2
                          size={20}
                          className="text-black/20"
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium">
                        {property.title}
                      </h3>

                      {property.featured && (
                        <Star
                          size={13}
                          fill="currentColor"
                          className="shrink-0"
                        />
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-black/45">
                      <MapPin size={13} />

                      <span className="truncate">
                        {property.location}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-black/35">
                      {property.bedrooms} beds ·{" "}
                      {property.bathrooms} baths ·{" "}
                      {property.area} m²
                    </p>
                  </div>
                </div>

                {/* Type */}

                <div className="mt-4 lg:mt-0">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-black/30 lg:hidden">
                    Type
                  </p>

                  <p className="text-sm">
                    {formatPropertyType(property.type)}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {property.listingType === "SALE"
                      ? "For Sale"
                      : "For Rent"}
                  </p>
                </div>

                {/* Price */}

                <div className="mt-4 lg:mt-0">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-black/30 lg:hidden">
                    Price
                  </p>

                  <p className="text-sm font-medium">
                    {formatPrice(
                      property.price,
                      property.currency,
                    )}
                  </p>
                </div>

                {/* Status */}

                <div className="mt-4 lg:mt-0">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-black/30 lg:hidden">
                    Agent
                  </p>

                  <p className="text-sm">
                    {property.agent?.name ?? "Unassigned"}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Active
                  </div>
                </div>

                {/* Actions */}

                <div className="mt-5 flex items-center justify-end gap-2 lg:mt-0">
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/5"
                    title="Edit property"
                  >
                    <Edit size={15} />
                  </Link>

                  <button
                    onClick={() =>
                      deleteProperty(property.id)
                    }
                    disabled={
                      deletingId === property.id
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    title="Delete property"
                  >
                    {deletingId === property.id ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-black/40">
          {label}
        </p>

        {icon && (
          <span className="text-black/30">
            {icon}
          </span>
        )}
      </div>

      <p className="font-display mt-4 text-4xl">
        {value}
      </p>
    </div>
  );
}

function LoadingRows() {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="animate-pulse border-b border-black/10 p-5 last:border-0 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_100px] lg:gap-6 lg:px-6"
        >
          <div className="flex gap-4">
            <div className="h-20 w-24 rounded-xl bg-black/10" />

            <div className="flex-1">
              <div className="h-4 w-2/3 rounded bg-black/10" />

              <div className="mt-3 h-3 w-1/2 rounded bg-black/10" />

              <div className="mt-3 h-3 w-1/3 rounded bg-black/10" />
            </div>
          </div>

          <div className="mt-4 h-4 w-20 rounded bg-black/10 lg:mt-0" />

          <div className="mt-4 h-4 w-24 rounded bg-black/10 lg:mt-0" />

          <div className="mt-4 h-4 w-20 rounded bg-black/10 lg:mt-0" />

          <div className="mt-4 h-9 w-20 rounded bg-black/10 lg:mt-0" />
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/5">
        <Building2 size={22} className="text-black/40" />
      </div>

      <h2 className="font-display mt-6 text-3xl">
        No properties yet
      </h2>

      <p className="mt-3 max-w-sm text-sm leading-6 text-black/45">
        Start building your property collection by
        adding your first listing.
      </p>

      <Link
        href="/admin/properties/new"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm text-white"
      >
        <Plus size={16} />
        Add property
      </Link>
    </div>
  );
}

function formatPropertyType(type: string) {
  return (
    type.charAt(0) +
    type.slice(1).toLowerCase()
  );
}