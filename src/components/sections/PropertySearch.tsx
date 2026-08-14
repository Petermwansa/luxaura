"use client";

import { Search, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";

const fields = [
  {
    label: "Location",
    value: "Lusaka, Zambia",
  },
  {
    label: "Property Type",
    value: "Any property",
  },
  {
    label: "Price Range",
    value: "Any price",
  },
];

export function PropertySearch() {
  return (
    <section className="relative z-20 -mt-10">
      <Container>
        <div className="rounded-2xl bg-white p-4 shadow-2xl shadow-black/10 md:p-5">
          <div className="grid md:grid-cols-[1fr_1fr_1fr_auto]">
            {fields.map((field, index) => (
              <div
                key={field.label}
                className={`px-5 py-3 ${
                  index !== 0
                    ? "border-t border-black/10 md:border-l md:border-t-0"
                    : ""
                }`}
              >
                <p className="mb-1 text-xs uppercase tracking-wider text-black/40">
                  {field.label}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {field.value}
                  </span>

                  <ChevronDown
                    size={15}
                    className="text-black/40"
                  />
                </div>
              </div>
            ))}

            <button className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 text-sm font-medium text-white transition hover:bg-[var(--accent)] md:mt-0">
              <Search size={17} />
              Search
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}