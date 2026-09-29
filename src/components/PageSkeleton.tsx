/**
 * Generic loading skeleton, picked up automatically by Next.js as the
 * Suspense fallback for a route segment (via that segment's loading.tsx)
 * while its async Server Component fetches data. Keeps navigation feeling
 * instant instead of a blank page during the fetch.
 */
export function PageSkeleton({ variant = "grid" }: { variant?: "grid" | "detail" }) {
  return (
    <div className="mx-auto max-w-[1600px] animate-pulse px-6 py-16 lg:px-8">
      <div className="h-3 w-40 bg-eo-platinum" />
      <div className="mt-8 h-3 w-24 bg-eo-platinum" />
      <div className="mt-3 h-10 w-72 bg-eo-platinum" />

      {variant === "grid" ? (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] bg-eo-taupe" />
              <div className="mt-4 h-3 w-20 bg-eo-platinum" />
              <div className="mt-2 h-3 w-32 bg-eo-platinum" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-[4/5] bg-eo-taupe" />
          <div className="flex flex-col gap-4">
            <div className="h-3 w-24 bg-eo-platinum" />
            <div className="h-8 w-64 bg-eo-platinum" />
            <div className="h-4 w-32 bg-eo-platinum" />
            <div className="mt-4 h-3 w-full max-w-md bg-eo-platinum" />
            <div className="h-3 w-full max-w-sm bg-eo-platinum" />
          </div>
        </div>
      )}
    </div>
  );
}
