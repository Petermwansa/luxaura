import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-10 md:py-16">
      <Container>
        <div className="rounded-3xl bg-[var(--dark)] px-6 py-20 text-center text-white md:px-10 md:py-28">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">
            Your next chapter
          </p>

          <h2 className="font-display mx-auto mt-6 max-w-3xl text-5xl leading-none md:text-7xl">
            Let&apos;s find somewhere
            <br />
            <i>you&apos;ll love.</i>
          </h2>

          <div className="mt-10">
            <Button variant="secondary">
              Start your search
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}