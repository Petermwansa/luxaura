"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  ClipboardList,
  Star,
  Users,
} from "lucide-react";

interface DashboardStats {
  totalProperties: number;
  featuredProperties: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  totalAgents: number;
}

export default function AdminDashboard() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          "/api/admin/dashboard",
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch dashboard stats",
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            "Failed to fetch dashboard stats",
          );
        }

        setStats(data.stats);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Properties",
      value: stats?.totalProperties,
      icon: Building2,
    },
    {
      label: "Featured Properties",
      value: stats?.featuredProperties,
      icon: Star,
    },
    {
      label: "Total Enquiries",
      value: stats?.totalEnquiries,
      icon: ClipboardList,
    },
    {
      label: "Pending Enquiries",
      value: stats?.pendingEnquiries,
      icon: ClipboardList,
    },
    {
      label: "Total Agents",
      value: stats?.totalAgents,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/10 bg-white px-6 py-7 md:px-10">
        <p className="text-xs uppercase tracking-[0.25em] text-black/40">
          Overview
        </p>

        <h1 className="font-display mt-3 text-4xl md:text-5xl">
          Dashboard
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
          Manage your properties, enquiries and
          property consultants from one place.
        </p>
      </header>

      <section className="p-6 md:p-10">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load dashboard statistics.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-black/50">
                      {card.label}
                    </p>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f6f2]">
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="mt-8">
                    {loading ? (
                      <div className="h-10 w-16 animate-pulse rounded-lg bg-black/10" />
                    ) : (
                      <p className="font-display text-4xl">
                        {card.value ?? 0}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Enquiries
            </p>

            <h2 className="font-display mt-3 text-3xl">
              Stay on top of leads.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-black/50">
              Review incoming viewing requests,
              contact prospective buyers and schedule
              property viewings.
            </p>

            <a
              href="/admin/enquiries"
              className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm text-white"
            >
              View enquiries
            </a>
          </div>

          <div className="rounded-2xl bg-black p-7 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Properties
            </p>

            <h2 className="font-display mt-3 text-3xl">
              Manage your collection.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/50">
              Add new properties, update existing
              listings and control which properties are
              featured.
            </p>

            <a
              href="/admin/properties"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm text-black"
            >
              Manage properties
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
