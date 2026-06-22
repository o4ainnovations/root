"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-ink">
          Something went wrong
        </h1>
        <hr className="border-border my-6 w-24 mx-auto" />
        <p className="font-serif text-lg text-muted-foreground mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="nav-link bg-ink text-background px-6 py-3 inline-block"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="nav-link border border-border px-6 py-3 inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
