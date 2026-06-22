import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Page Not Found",
  description: "",
  path: "/404",
  robots: { index: false, follow: true },
});

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-ink">404</h1>
        <hr className="border-border my-6 w-24 mx-auto" />
        <p className="font-serif text-lg text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="nav-link bg-ink text-background px-6 py-3 inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
