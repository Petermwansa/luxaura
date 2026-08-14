"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { PropertyType } from "@/types/property";

export interface Filters {
  listingType: "All" | "For Sale" | "For Rent";
  propertyType: "All" | PropertyType;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

interface PropertyFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PropertyFilters({
  filters,
  setFilters,
  mobileOpen,
  setMobileOpen,
}: PropertyFiltersProps) {
  function updateFilter(
    key: keyof Filters,
    value: string
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters({
      listingType: "All",
      propertyType: "All",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    });
  }

  return (
    <>
      <aside
        className={`fixed inset-0 z-[60] bg-white p-6 transition-transform duration-300 md:static md:z-auto md:block md:w-64 md:shrink-0 md:translate-x-0 md:bg-transparent md:p-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between md:hidden">
          <h2 className="font-display text-3xl">
            Filters
          </h2>

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close filters"
          >
            <X />
          </button>
        </div>

        <div className="mt-8 space-y-8 md:mt-0">
          <FilterGroup title="Listing">
            {["All", "For Sale", "For Rent"].map(
              (value) => (
                <button
                  key={value}
                  onClick={() =>
                    updateFilter("listingType", value)
                  }
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    filters.listingType === value
                      ? "bg-black text-white"
                      : "hover:bg-black/5"
                  }`}
                >
                  {value}
                </button>
              )
            )}
          </FilterGroup>

          <FilterGroup title="Property type">
            {[
              "All",
              "Apartment",
              "Villa",
              "House",
              "Commercial",
              "Land",
            ].map((value) => (
              <button
                key={value}
                onClick={() =>
                  updateFilter("propertyType", value)
                }
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  filters.propertyType === value
                    ? "bg-black text-white"
                    : "hover:bg-black/5"
                }`}
              >
                {value}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Bedrooms">
            {["Any", "1+", "2+", "3+", "4+", "5+"].map(
              (value) => (
                <button
                  key={value}
                  onClick={() =>
                    updateFilter(
                      "bedrooms",
                      value === "Any" ? "" : value
                    )
                  }
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    (value === "Any" &&
                      filters.bedrooms === "") ||
                    filters.bedrooms === value
                      ? "bg-black text-white"
                      : "hover:bg-black/5"
                  }`}
                >
                  {value}
                </button>
              )
            )}
          </FilterGroup>

          <FilterGroup title="Price">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(event) =>
                  updateFilter(
                    "minPrice",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              />

              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(event) =>
                  updateFilter(
                    "maxPrice",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
          </FilterGroup>

          <button
            onClick={resetFilters}
            className="text-sm underline underline-offset-4"
          >
            Reset filters
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-50 hidden bg-black/40 md:hidden"
          aria-label="Close filters"
        />
      )}
    </>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">
        {title}
      </h3>

      <div className="space-y-1">{children}</div>
    </div>
  );
}