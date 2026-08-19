"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  Loader2,
  MessageSquare,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

interface Favorite {
  id: string;
  createdAt: string;
  property: {
    id: string;
    slug: string;
    title: string;
    location: string;
    price: number;
    currency: string;
    listingType: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
}

interface Enquiry {
  id: string;
  status: string;
  date: string;
  createdAt: string;
  property: {
    id: string;
    slug: string;
    title: string;
    images: string[];
  };
}

export default function AccountPage() {
  const { user, isLoaded } = useUser();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [loadingFavorites, setLoadingFavorites] =
    useState(true);

  const [loadingEnquiries, setLoadingEnquiries] =
    useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    async function fetchAccountData() {
      try {
        setLoadingFavorites(true);
        setLoadingEnquiries(true);

        const [favoritesResponse, enquiriesResponse] =
          await Promise.all([
            fetch("/api/favorites"),
            fetch("/api/enquiries"),
          ]);

        if (favoritesResponse.ok) {
          const favoritesData =
            await favoritesResponse.json();

          setFavorites(
            Array.isArray(favoritesData)
              ? favoritesData
              : favoritesData.favorites ?? [],
          );
        }

        if (enquiriesResponse.ok) {
          const enquiriesData =
            await enquiriesResponse.json();

          setEnquiries(
            Array.isArray(enquiriesData)
              ? enquiriesData
              : enquiriesData.enquiries ?? [],
          );
        }
      } catch (error) {
        console.error(
          "Failed to load account data:",
          error,
        );
      } finally {
        setLoadingFavorites(false);
        setLoadingEnquiries(false);
      }
    }

    fetchAccountData();
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#f7f6f2] pt-32">
          <Container>
            <div className="flex min-h-[500px] items-center justify-center">
              <Loader2
                size={24}
                className="animate-spin"
              />
            </div>
          </Container>
        </main>

        <Footer />
      </>
    );
  }

  const firstName =
    user?.firstName ||
    user?.fullName?.split(" ")[0] ||
    "there";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f6f2] pt-28 md:pt-32">
        <Container>
          {/* Header */}
          <section className="border-b border-black/10 pb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Your account
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="font-display text-5xl leading-none md:text-7xl">
                  Welcome,{" "}
                  <i>{firstName}.</i>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--muted)]">
                  Manage your saved properties, viewing
                  requests, and account activity.
                </p>
              </div>

              {user?.imageUrl && (
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-black/10">
                  <Image
                    src={user.imageUrl}
                    alt={firstName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Stats */}
          <section className="grid gap-4 py-8 md:grid-cols-3">
            <StatCard
              icon={<Heart size={19} />}
              label="Saved properties"
              value={
                loadingFavorites
                  ? "—"
                  : favorites.length.toString()
              }
              href="/account/favorites"
            />

            <StatCard
              icon={<MessageSquare size={19} />}
              label="Viewing requests"
              value={
                loadingEnquiries
                  ? "—"
                  : enquiries.length.toString()
              }
              href="/account/enquiries"
            />

            <StatCard
              icon={<CalendarDays size={19} />}
              label="Upcoming viewings"
              value={
                loadingEnquiries
                  ? "—"
                  : enquiries.filter(
                      (enquiry) =>
                        new Date(enquiry.date) >=
                        new Date(),
                    ).length.toString()
              }
              href="/account/enquiries"
            />
          </section>

          {/* Main content */}
          <section className="grid gap-8 pb-20 lg:grid-cols-[1fr_320px]">
            {/* Recent favorites */}
            <div className="rounded-2xl bg-white p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                    Your collection
                  </p>

                  <h2 className="font-display mt-2 text-3xl">
                    Recently saved
                  </h2>
                </div>

                <Link
                  href="/account/favorites"
                  className="group flex items-center gap-2 text-sm"
                >
                  View all
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>

              <div className="mt-7">
                {loadingFavorites ? (
                  <div className="flex min-h-[220px] items-center justify-center">
                    <Loader2
                      size={22}
                      className="animate-spin"
                    />
                  </div>
                ) : favorites.length === 0 ? (
                  <EmptyState
                    icon={<Heart size={22} />}
                    title="No saved properties"
                    description="Properties you save will appear here."
                    actionLabel="Explore properties"
                    actionHref="/properties"
                  />
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {favorites
                      .slice(0, 4)
                      .map((favorite) => (
                        <FavoritePreview
                          key={favorite.id}
                          favorite={favorite}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <aside className="space-y-4">
              <div className="rounded-2xl bg-black p-7 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Looking for something?
                </p>

                <h2 className="font-display mt-3 text-3xl leading-tight">
                  Find your next place.
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/50">
                  Explore our collection of carefully
                  selected properties.
                </p>

                <Link
                  href="/properties"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm text-black transition hover:bg-white/90"
                >
                  Browse properties
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div className="rounded-2xl bg-white p-7">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Account
                </p>

                <div className="mt-5 space-y-1">
                  <AccountLink
                    href="/account/favorites"
                    icon={<Heart size={17} />}
                    label="Saved properties"
                  />

                  <AccountLink
                    href="/account/enquiries"
                    icon={<MessageSquare size={17} />}
                    label="My enquiries"
                  />

                  <AccountLink
                    href="/account/profile"
                    icon={<CalendarDays size={17} />}
                    label="Profile settings"
                  />
                </div>
              </div>
            </aside>
          </section>
        </Container>
      </main>

      <Footer />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f6f2]">
          {icon}
        </div>

        <ArrowUpRight
          size={17}
          className="text-black/30 transition group-hover:text-black"
        />
      </div>

      <p className="mt-7 text-xs uppercase tracking-[0.15em] text-black/40">
        {label}
      </p>

      <p className="font-display mt-2 text-4xl">
        {value}
      </p>
    </Link>
  );
}

function FavoritePreview({
  favorite,
}: {
  favorite: Favorite;
}) {
  const property = favorite.property;

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex gap-4 rounded-xl border border-black/10 p-3 transition hover:border-black/30"
    >
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-black/5">
        {property.images?.[0] && (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="112px"
          />
        )}
      </div>

      <div className="min-w-0 py-1">
        <h3 className="font-display truncate text-xl">
          {property.title}
        </h3>

        <p className="mt-1 truncate text-xs text-[var(--muted)]">
          {property.location}
        </p>

        <p className="mt-3 text-sm font-semibold">
          {property.currency === "USD" && "$"}
          {property.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-black/10 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f6f2]">
        {icon}
      </div>

      <h3 className="font-display mt-4 text-2xl">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
        {description}
      </p>

      <Link
        href={actionHref}
        className="mt-5 rounded-full bg-black px-5 py-3 text-sm text-white"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function AccountLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm transition hover:bg-[#f7f6f2]"
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>

      <ArrowUpRight
        size={15}
        className="text-black/30"
      />
    </Link>
  );
}