import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PropertyForm } from "@/components/admin/properties/PropertyForm";

export default function NewPropertyPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <Link
          href="/admin/properties"
          className="mb-8 inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
        >
          <ChevronLeft size={16} />
          Back to properties
        </Link>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Property management
          </p>

          <h1 className="font-display mt-3 text-5xl tracking-tight">
            Add property
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
            Create a new property listing for your
            Luxaura collection.
          </p>
        </div>

        <PropertyForm mode="create" />
      </div>
    </main>
  );
}