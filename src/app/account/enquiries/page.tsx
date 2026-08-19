"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  status: string;
  createdAt: string;

  property: {
    id: string;
    slug: string;
    title: string;
    location: string;
    images: string[];
    price: number;
    currency: string;
    listingType: string;
  };
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/enquiries",
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Failed to fetch enquiries.",
          );
        }

        setEnquiries(data.enquiries);
      } catch (error) {
        console.error(
          "Failed to fetch enquiries:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEnquiries();
  }, []);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-ZM", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function formatStatus(status: string) {
    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        {/* Header */}

        <div className="mb-10">
          <Link
            href="/account"
            className="text-sm text-black/50 transition hover:text-black"
          >
            ← Back to account
          </Link>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-black/40">
            Your activity
          </p>

          <h1 className="font-display mt-3 text-5xl tracking-tight md:text-6xl">
            My enquiries
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
            View and track the property viewing
            requests you have submitted.
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-white p-5"
              >
                <div className="flex gap-6">
                  <div className="h-40 w-52 rounded-xl bg-black/10" />

                  <div className="flex-1">
                    <div className="h-5 w-1/3 rounded bg-black/10" />

                    <div className="mt-4 h-4 w-1/4 rounded bg-black/10" />

                    <div className="mt-8 h-4 w-1/2 rounded bg-black/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-10 text-center">
            <h2 className="font-display text-3xl">
              Something went wrong
            </h2>

            <p className="mt-3 text-sm text-black/50">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          enquiries.length === 0 && (
            <div className="rounded-2xl bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f6f2]">
                <CalendarDays size={24} />
              </div>

              <h2 className="font-display mt-6 text-3xl">
                No enquiries yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/50">
                When you request a viewing, your
                enquiries will appear here.
              </p>

              <Link
                href="/properties"
                className="mt-7 inline-flex rounded-full bg-black px-6 py-3 text-sm text-white"
              >
                Browse properties
              </Link>
            </div>
          )}

        {/* Enquiries */}

        {!loading &&
          !error &&
          enquiries.length > 0 && (
            <div className="space-y-6">
              {enquiries.map((enquiry) => {
                const property =
                  enquiry.property;

                return (
                  <article
                    key={enquiry.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Property image */}

                      <Link
                        href={`/properties/${property.slug}`}
                        className="relative block h-64 shrink-0 overflow-hidden md:h-auto md:w-64"
                      >
                        <Image
                          src={
                            property.images[0]
                          }
                          alt={property.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 256px"
                          className="object-cover transition duration-500 hover:scale-105"
                        />
                      </Link>

                      {/* Content */}

                      <div className="flex-1 p-6 md:p-7">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                          <div>
                            <Link
                              href={`/properties/${property.slug}`}
                              className="group inline-flex items-center gap-2"
                            >
                              <h2 className="font-display text-3xl leading-none">
                                {property.title}
                              </h2>

                              <ArrowUpRight
                                size={17}
                                className="opacity-0 transition group-hover:opacity-100"
                              />
                            </Link>

                            <div className="mt-3 flex items-center gap-1.5 text-sm text-black/50">
                              <MapPin
                                size={14}
                              />

                              {property.location}
                            </div>
                          </div>

                          <span
                            className={`w-fit rounded-full px-4 py-2 text-xs font-medium ${getStatusClass(
                              enquiry.status,
                            )}`}
                          >
                            {formatStatus(
                              enquiry.status,
                            )}
                          </span>
                        </div>

                        {/* Viewing date */}

                        <div className="mt-7 grid gap-4 border-y border-black/10 py-5 md:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f6f2]">
                              <CalendarDays
                                size={16}
                              />
                            </div>

                            <div>
                              <p className="text-xs text-black/40">
                                Requested viewing
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {formatDate(
                                  enquiry.date,
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f6f2]">
                              <Clock3
                                size={16}
                              />
                            </div>

                            <div>
                              <p className="text-xs text-black/40">
                                Submitted
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {formatDate(
                                  enquiry.createdAt,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Message */}

                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-widest text-black/40">
                            Your message
                          </p>

                          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                            {enquiry.message}
                          </p>
                        </div>

                        {/* Property link */}

                        <div className="mt-6">
                          <Link
                            href={`/properties/${property.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
                          >
                            View property
                            <ArrowUpRight
                              size={15}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </div>
    </main>
  );
}