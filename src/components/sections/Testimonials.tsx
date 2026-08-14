import { Container } from "@/components/ui/Container";

export function Testimonials() {
  return (
    <section className="py-28 md:py-36">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
            Client stories
          </p>

          <blockquote className="font-display mt-8 text-4xl leading-tight md:text-6xl">
            “Luxora made the entire process feel effortless.
            They understood exactly what we were looking for.”
          </blockquote>

          <div className="mt-10">
            <p className="text-sm font-medium">
              Daniel & Sarah
            </p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Lusaka, Zambia
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}