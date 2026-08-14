import { Container } from "@/components/ui/Container";

const stats = [
  {
    value: "12+",
    label: "Years of experience",
  },
  {
    value: "450+",
    label: "Properties sold",
  },
  {
    value: "320+",
    label: "Happy clients",
  },
  {
    value: "18",
    label: "Real estate experts",
  },
];

export function Stats() {
  return (
    <section className="border-b border-black/10 py-20">
      <Container>
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-5xl md:text-6xl">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}