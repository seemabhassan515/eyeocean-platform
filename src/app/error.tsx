"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        Something went wrong
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">
        An unexpected error occurred
      </h1>
      <p className="mt-4 text-sm text-eo-grey">
        Please try again, or return to the homepage if the problem continues.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
        <Button as="a" href="/" variant="secondary">
          Return Home
        </Button>
      </div>
      <Link
        href="/#concierge"
        className="mt-6 text-[11px] font-medium uppercase tracking-[0.12em] underline decoration-eo-champagne underline-offset-4"
      >
        Contact the Concierge
      </Link>
    </div>
  );
}
