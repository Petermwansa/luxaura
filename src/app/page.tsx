import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Container className="flex min-h-screen flex-col justify-center">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
          Premium Real Estate
        </p>

        <h1 className="font-display max-w-4xl text-6xl leading-[0.9] tracking-tight sm:text-7xl lg:text-9xl">
          Find a place
          <br />
          worth calling home.
        </h1>

        <p className="mt-8 max-w-xl text-base leading-7 text-[var(--muted)]">
          Discover exceptional properties, thoughtfully selected
          for people who appreciate beautiful spaces.
        </p>

        <div className="mt-10">
          <Button>Explore Properties</Button>
        </div>
      </Container>
    </main>
  );
}