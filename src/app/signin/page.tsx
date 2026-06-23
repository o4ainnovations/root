"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full card-depth-2 p-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-ink mb-2">
          O4A
        </h1>
        <p className="font-serif text-muted-foreground mb-8">
          Sign in to access the admin panel
        </p>

        <hr className="border-hairline my-6" />

        <button
          onClick={() => signIn("github", { callbackUrl })}
          className="w-full nav-link bg-ink text-background px-6 py-4"
        >
          Sign in with GitHub
        </button>

        <p className="label-uppercase mt-8">
          <Link href="/" className="hover:text-ink transition-colors">
            &larr; Return to O4A
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="card-depth-2 p-10">
            <div className="h-8 w-32 bg-paper-shadow animate-pulse" />
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
