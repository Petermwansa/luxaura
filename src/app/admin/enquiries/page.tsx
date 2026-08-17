"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Building2,
  CalendarDays,
  Mail,
  Phone,
  Search,
} from "lucide-react";

interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  images: string[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  status:
    | "PENDING"
    | "CONTACTED"
    | "VIEWING_SCHEDULED"
    | "COMPLETED"
    | "CANCELLED";
  createdAt: string;
  property: Property;
  agent: Agent | null;
}

type StatusFilter =
  | "ALL"
  | Enquiry["status"];

const statusLabels: Record<
  Enquiry["status"],
  string
> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  VIEWING_SCHEDULED: "Viewing scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] =
    useState<Enquiry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/admin/enquiries",
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch enquiries",
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            "Failed to fetch enquiries",
          );
        }

        setEnquiries(data.enquiries);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const query =
        search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        enquiry.name
          .toLowerCase()
          .includes(query) ||
        enquiry.email
          .toLowerCase()
          .includes(query) ||
        enquiry.property.title
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        enquiry.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [enquiries, search, statusFilter]);

  async function updateStatus(
    id: string,
    status: Enquiry["status"],
  ) {
    try {
      setUpdatingId(id);

      const response = await fetch(
        `/api/admin/enquiries/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to update enquiry.",
        );
      }

      setEnquiries((current) =>
        current.map((enquiry) =>
          enquiry.id === id
            ? {
                ...enquiry,
                status,
              }
            : enquiry,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update enquiry status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}

      <header className="border-b border-black/10 bg-white px-6 py-7 md:px-10">
        <p className="text-xs uppercase tracking-[0.25em] text-black/40">
          Management
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">
              Enquiries
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              Manage property viewing requests and
              follow up with prospective clients.
            </p>
          </div>

          <div className="rounded-full bg-black px-4 py-2 text-sm text-white">
            {enquiries.length}{" "}
            {enquiries.length === 1
              ? "enquiry"
              : "enquiries"}
          </div>
        </div>
      </header>

      <section className="p-6 md:p-10">
        {/* Filters */}

        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by name, email or property..."
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
            />
          </div>

          <div className="relative">
            <ArrowUpDown
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                )
              }
              className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white pl-11 pr-10 text-sm outline-none md:w-56"
            >
              <option value="ALL">
                All statuses
              </option>

              {Object.entries(
                statusLabels,
              ).map(([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-black/5"
              />
            ))}
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load enquiries. Please
            refresh the page and try again.
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredEnquiries.length === 0 && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f6f2]">
                <Mail size={20} />
              </div>

              <h2 className="font-display mt-6 text-3xl">
                No enquiries found
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
                There are no enquiries matching
                your current search or filters.
              </p>
            </div>
          )}

        {/* Desktop table */}

        {!loading &&
          !error &&
          filteredEnquiries.length > 0 && (
            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10 text-left">
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-black/40">
                        Client
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-black/40">
                        Property
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-black/40">
                        Viewing date
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-black/40">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-black/40">
                        Agent
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEnquiries.map(
                      (enquiry) => (
                        <tr
                          key={enquiry.id}
                          className="border-b border-black/5 last:border-0"
                        >
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-medium">
                                {enquiry.name}
                              </p>

                              <p className="mt-1 text-xs text-black/40">
                                {
                                  enquiry.email
                                }
                              </p>

                              <a
                                href={`tel:${enquiry.phone}`}
                                className="mt-1 block text-xs text-black/40 hover:text-black"
                              >
                                {
                                  enquiry.phone
                                }
                              </a>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <Link
                              href={`/properties/${enquiry.property.slug}`}
                              target="_blank"
                              className="group flex items-center gap-3"
                            >
                              {enquiry
                                .property
                                .images?.[0] && (
                                <img
                                  src={
                                    enquiry
                                      .property
                                      .images[0]
                                  }
                                  alt={
                                    enquiry
                                      .property
                                      .title
                                  }
                                  className="h-12 w-16 rounded-lg object-cover"
                                />
                              )}

                              <div>
                                <p className="font-medium group-hover:underline">
                                  {
                                    enquiry
                                      .property
                                      .title
                                  }
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  {
                                    enquiry
                                      .property
                                      .location
                                  }
                                </p>
                              </div>
                            </Link>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarDays
                                size={15}
                                className="text-black/40"
                              />

                              {formatDate(
                                enquiry.date,
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <StatusSelect
                              status={
                                enquiry.status
                              }
                              loading={
                                updatingId ===
                                enquiry.id
                              }
                              onChange={(
                                status,
                              ) =>
                                updateStatus(
                                  enquiry.id,
                                  status,
                                )
                              }
                            />
                          </td>

                          <td className="px-6 py-5">
                            {enquiry.agent ? (
                              <div>
                                <p className="text-sm font-medium">
                                  {
                                    enquiry
                                      .agent
                                      .name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  {
                                    enquiry
                                      .agent
                                      .phone
                                  }
                                </p>
                              </div>
                            ) : (
                              <span className="text-sm text-black/40">
                                Unassigned
                              </span>
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Mobile cards */}

        {!loading &&
          !error &&
          filteredEnquiries.length > 0 && (
            <div className="space-y-4 lg:hidden">
              {filteredEnquiries.map(
                (enquiry) => (
                  <div
                    key={enquiry.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex gap-4">
                      {enquiry.property
                        .images?.[0] && (
                        <img
                          src={
                            enquiry.property
                              .images[0]
                          }
                          alt={
                            enquiry.property
                              .title
                          }
                          className="h-20 w-24 shrink-0 rounded-xl object-cover"
                        />
                      )}

                      <div className="min-w-0">
                        <Link
                          href={`/properties/${enquiry.property.slug}`}
                          target="_blank"
                          className="font-medium hover:underline"
                        >
                          {
                            enquiry.property
                              .title
                          }
                        </Link>

                        <p className="mt-1 text-xs text-black/40">
                          {
                            enquiry.property
                              .location
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-black/10 pt-5">
                      <p className="font-medium">
                        {enquiry.name}
                      </p>

                      <a
                        href={`mailto:${enquiry.email}`}
                        className="mt-2 flex items-center gap-2 text-sm text-black/50"
                      >
                        <Mail size={14} />
                        {enquiry.email}
                      </a>

                      <a
                        href={`tel:${enquiry.phone}`}
                        className="mt-2 flex items-center gap-2 text-sm text-black/50"
                      >
                        <Phone size={14} />
                        {enquiry.phone}
                      </a>

                      <div className="mt-4 flex items-center gap-2 text-sm text-black/50">
                        <CalendarDays
                          size={15}
                        />

                        {formatDate(
                          enquiry.date,
                        )}
                      </div>

                      <div className="mt-5">
                        <StatusSelect
                          status={
                            enquiry.status
                          }
                          loading={
                            updatingId ===
                            enquiry.id
                          }
                          onChange={(
                            status,
                          ) =>
                            updateStatus(
                              enquiry.id,
                              status,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
      </section>
    </div>
  );
}

function StatusSelect({
  status,
  loading,
  onChange,
}: {
  status: Enquiry["status"];
  loading: boolean;
  onChange: (
    status: Enquiry["status"],
  ) => void;
}) {
  return (
    <select
      value={status}
      disabled={loading}
      onChange={(event) =>
        onChange(
          event.target
            .value as Enquiry["status"],
        )
      }
      className={`rounded-full border px-3 py-2 text-xs font-medium outline-none transition disabled:cursor-not-allowed disabled:opacity-50 ${getStatusClasses(
        status,
      )}`}
    >
      {Object.entries(statusLabels).map(
        ([value, label]) => (
          <option
            key={value}
            value={value}
          >
            {label}
          </option>
        ),
      )}
    </select>
  );
}

function getStatusClasses(
  status: Enquiry["status"],
) {
  switch (status) {
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "CONTACTED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "VIEWING_SCHEDULED":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "COMPLETED":
      return "border-green-200 bg-green-50 text-green-700";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-black/10 bg-white text-black";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(date));
}