"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateKey } from "@/lib/actions/hello";

export default function HelloPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError("");

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") || undefined;

    try {
      const result = await validateKey(key, ref || "");
      if (result.success && result.redirect) {
        router.push(result.redirect);
      } else {
        setError(result.error || "An error occurred.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="card-depth-2 p-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-ink mb-4">
            Access Required
          </h1>

          <hr className="border-hairline my-6" />

          <p className="font-serif text-foreground leading-relaxed mb-8">
            This content is protected. Enter the secret key to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter secret key"
              className="w-full border border-border bg-background px-4 py-3 font-serif text-foreground rounded-none focus:outline-none focus:ring-1 focus:ring-ink"
              autoFocus
            />
            {error && (
              <p className="text-sm font-serif text-red-800">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full nav-link bg-ink text-background px-6 py-3 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Unlock"}
            </button>
          </form>

          <p className="label-uppercase mt-8">
            <Link href="/" className="hover:text-ink transition-colors">
              &larr; Return to O4A
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
