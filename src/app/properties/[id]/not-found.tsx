import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-5">
      <div className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Property not found
        </p>

        <h1 className="font-display mt-5 text-6xl leading-none md:text-8xl">
          This place
          <br />
          doesn&apos;t exist.
        </h1>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[var(--muted)]">
          The property you&apos;re looking for may have been
          removed or the link may be incorrect.
        </p>

        <Link
          href="/properties"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-white"
        >
          <ArrowLeft size={16} />
          Browse properties
        </Link>
      </div>
    </main>
  );
}