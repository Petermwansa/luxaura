import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-[var(--dark)] pb-10 pt-24 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-display text-4xl"
            >
              LUXORA
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Exceptional properties for exceptional ways
              of living.
            </p>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-widest text-white/40">
              Explore
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/70">
              <Link href="/properties">Properties</Link>
              <Link href="/about">About us</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-widest text-white/40">
              Contact
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/70">
              <p>hello@luxora.com</p>
              <p>+260 97 000 0000</p>
              <p>Lusaka, Zambia</p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 Luxora. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}