import { Container } from "@/components/ui/Container";

export function About() {
  return (
    <section className="bg-[#111111] py-28 text-white md:py-36">
      <Container>
        <div className="grid gap-16 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
              About Luxora
            </p>
          </div>

          <div>
            <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
              We believe the right
              <br />
              <i>space changes everything.</i>
            </h2>

            <p className="mt-10 max-w-2xl text-base leading-8 text-white/60">
              From contemporary city apartments to secluded
              architectural residences, we connect people with
              properties that reflect how they want to live.
            </p>

            <div className="mt-10">
              <button className="border-b border-white/40 pb-2 text-sm transition hover:border-white">
                Discover our story →
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}