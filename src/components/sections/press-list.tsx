"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { PressRelease } from "@/types";

const categoryLabels: Record<string, string> = {
  corporate: "Corporate",
  product: "Product",
  partnership: "Partnership",
};

export function PressList({
  releases,
  years,
}: {
  releases: PressRelease[];
  years: string[];
}) {
  const [activeYear, setActiveYear] = useState<string | null>(null);

  const filtered = activeYear
    ? releases.filter((r) => new Date(r.date).getFullYear().toString() === activeYear)
    : releases;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveYear(null)}
          className={cn(
            "label-uppercase px-3 py-1 border border-border transition-colors",
            !activeYear && "bg-ink text-background",
          )}
        >
          All
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={cn(
              "label-uppercase px-3 py-1 border border-border transition-colors",
              activeYear === year && "bg-ink text-background",
            )}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((release) => (
          <Card key={release._id} className="card-depth-1 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                      {new Date(release.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-border text-ink"
                    >
                      {categoryLabels[release.category] || release.category}
                    </Badge>
                  </div>
                  <h4 className="font-heading text-xl font-bold text-ink mb-2">
                    {release.title}
                  </h4>
                </div>
                <Link
                  href={`/news/${release.slug.current}`}
                  className="flex-shrink-0 nav-link text-xs whitespace-nowrap"
                >
                  Read &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-muted-foreground font-serif italic py-8 text-center">
            No press releases found for this year.
          </p>
        )}
      </div>
    </div>
  );
}
