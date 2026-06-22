import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Building2 } from "lucide-react";
import type { JobListing } from "@/types";

export function JobCard({ job }: { job: JobListing }) {
  return (
    <Card className="card-depth-1 group transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold text-ink group-hover:text-gold transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap gap-3 mt-3 mb-4">
              <span className="label-uppercase inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span className="label-uppercase inline-flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.type}
              </span>
              <span className="label-uppercase inline-flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {job.subsidiary}
              </span>
            </div>
            <Badge
              variant="outline"
              className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-border text-ink"
            >
              {job.department}
            </Badge>
          </div>

          {job.url && (
            <Link
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 nav-link bg-ink text-background px-4 py-2 text-xs"
            >
              Apply
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
