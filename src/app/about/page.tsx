import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Compass,
  Heart,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#f7f6f2]">
        {/* Hero */}
        <section className="bg-[#111111] pb-24 pt-36 text-white md:pb-32 md:pt-44">
          <Container>
            <div className="max-w-5xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                About Luxaura
              </p>

              <h1 className="font-display mt-6 text-6xl leading-[0.9] md:text-8xl lg:text-9xl">
                Property,
                <br />
                <i>with purpose.</i>
              </h1>

              <p className="mt-8 max-w-2xl text-sm leading-7 text-white/55 md:text-base md:leading-8">
                We believe finding a property should feel less like a
                transaction and more like finding a place that truly belongs
                to you.
              </p>
            </div>
          </Container>
        </section>

        {/* Introduction */}
        <section className="py-20 md:py-28">
          <Container>
            <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  Our story
                </p>
              </div>

              <div>
                <h2 className="font-display max-w-3xl text-4xl leading-tight md:text-6xl">
                  A better way to discover property in Lusaka.
                </h2>

                <div className="mt-8 max-w-2xl space-y-5 text-sm leading-7 text-[var(--muted)] md:text-base md:leading-8">
                  <p>
                    Luxaura was created with a simple idea: property
                    discovery should be thoughtful, transparent, and
                    beautifully simple.
                  </p>

                  <p>
                    Instead of overwhelming you with endless listings, we
                    focus on presenting properties that deserve your
                    attention. From modern apartments to spacious family
                    homes and investment opportunities, every property has a
                    story to tell.
                  </p>

                  <p>
                    Our goal is to make that story easier to discover while
                    giving buyers, renters, and investors the confidence to
                    make the right decision.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Values */}
        <section className="border-y border-black/10 bg-white py-20 md:py-28">
          <Container>
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                What guides us
              </p>

              <h2 className="font-display mt-5 text-4xl leading-tight md:text-6xl">
                The Luxaura approach.
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <ValueCard
                icon={<Compass size={22} />}
                number="01"
                title="Curated"
                description="We focus on quality over quantity, making it easier to discover properties that genuinely fit your needs."
              />

              <ValueCard
                icon={<Heart size={22} />}
                number="02"
                title="Personal"
                description="Every property search is different. We aim to make the experience feel personal, clear, and human."
              />

              <ValueCard
                icon={<Sparkles size={22} />}
                number="03"
                title="Thoughtful"
                description="From the first search to the final viewing, we pay attention to the details that make the experience better."
              />
            </div>
          </Container>
        </section>

        {/* What we do */}
        <section className="py-20 md:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  What we do
                </p>

                <h2 className="font-display mt-5 text-4xl leading-tight md:text-6xl">
                  More than
                  <br />
                  <i>property listings.</i>
                </h2>
              </div>

              <div className="space-y-0">
                <ServiceItem
                  title="Property discovery"
                  description="Explore carefully selected homes, apartments, and investment properties in desirable locations."
                />

                <ServiceItem
                  title="Buying & renting"
                  description="Whether you're searching for your next home or your next investment, we're here to make the process easier."
                />

                <ServiceItem
                  title="Property viewings"
                  description="Found something you like? Request a viewing and connect with the right property consultant."
                />

                <ServiceItem
                  title="Local perspective"
                  description="Our focus on the Lusaka property market helps you discover opportunities with greater confidence."
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Location */}
        <section className="bg-[#111111] py-20 text-white md:py-28">
          <Container>
            <div className="grid gap-12 md:grid-cols-2 md:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Where we are
                </p>

                <h2 className="font-display mt-5 text-5xl leading-[0.95] md:text-7xl">
                  Rooted in
                  <br />
                  <i>Lusaka.</i>
                </h2>
              </div>

              <div>
                <p className="max-w-lg text-sm leading-7 text-white/50 md:text-base md:leading-8">
                  Lusaka is a city of growth, opportunity, and constantly
                  changing possibilities. We're passionate about helping
                  people discover the spaces that allow them to be part of
                  that growth.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <Container>
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm md:px-12 md:py-24">
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                Your next chapter
              </p>

              <h2 className="font-display mx-auto mt-5 max-w-3xl text-5xl leading-[0.95] md:text-7xl">
                Ready to find your
                <br />
                <i>next place?</i>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">
                Explore our collection of carefully selected properties and
                discover a place that feels right for you.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/properties"
                  className="group flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-black/80"
                >
                  Explore properties

                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-medium transition hover:border-black"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ---------------------------------- */
/* Value Card */
/* ---------------------------------- */

function ValueCard({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f7f6f2] p-7 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
          {icon}
        </div>

        <span className="text-xs text-black/30">
          {number}
        </span>
      </div>

      <h3 className="font-display mt-10 text-3xl">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* Service Item */
/* ---------------------------------- */

function ServiceItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-black/10 py-7 first:border-t-0 lg:py-8">
      <div className="flex gap-5">
        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <Check size={13} />
        </div>

        <div>
          <h3 className="font-display text-2xl">
            {title}
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}