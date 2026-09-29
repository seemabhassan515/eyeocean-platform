import { Button } from "@/components/ui/Button";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        404
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">
        Page Not Found
      </h1>
      <p className="mt-4 text-sm text-eo-grey">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Button as="a" href="/" variant="primary">
          Return Home
        </Button>
        <Button as="a" href="/new-arrivals" variant="secondary">
          Explore Collections
        </Button>
      </div>
    </div>
  );
}
