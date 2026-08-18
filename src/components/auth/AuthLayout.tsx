import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  description: string;
}

export function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left side */}
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
            alt="Luxury modern property"
            fill
            priority
            className="object-cover"
            sizes="55vw"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">
            <Link
              href="/"
              className="relative z-10 font-display text-3xl text-white"
            >
              Luxora
            </Link>

            <div className="relative z-10 max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Premium Real Estate
              </p>

              <h1 className="font-display mt-6 text-6xl leading-[0.92] text-white xl:text-7xl">
                {title}
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/70">
                {description}
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
              <span className="h-px w-10 bg-white/40" />
              Exceptional places. Exceptional living.
            </div>
          </div>
        </section>

        {/* Right side */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-12 block font-display text-3xl lg:hidden"
            >
              Luxora
            </Link>

            {children}

            <Link
              href="/"
              className="mt-10 inline-flex items-center text-sm text-black/50 transition hover:text-black"
            >
              ← Back to website
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}