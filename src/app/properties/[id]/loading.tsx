export default function Loading() {
  return (
    <main className="bg-[#f7f6f2] pt-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="aspect-[16/9] animate-pulse rounded-2xl bg-black/10 md:aspect-[16/8]" />

        <div className="grid gap-14 py-16 lg:grid-cols-[1fr_380px] lg:py-24">
          <div>
            <div className="h-6 w-24 animate-pulse rounded-full bg-black/10" />

            <div className="mt-6 h-20 w-3/4 animate-pulse rounded-xl bg-black/10" />

            <div className="mt-5 h-4 w-40 animate-pulse rounded bg-black/10" />

            <div className="mt-10 h-10 w-40 animate-pulse rounded bg-black/10" />

            <div className="mt-10 h-24 animate-pulse rounded-xl bg-black/10" />

            <div className="mt-10 h-40 animate-pulse rounded-xl bg-black/10" />
          </div>

          <div className="h-[500px] animate-pulse rounded-2xl bg-black/10" />
        </div>
      </div>
    </main>
  );
}