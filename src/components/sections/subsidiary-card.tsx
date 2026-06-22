import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subsidiary } from "@/types";

export function SubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  const isActive = subsidiary.status === "active";

  return (
    <Card
      className={cn(
        "card-depth-2 transition-shadow duration-200 group",
        !isActive && "opacity-60",
      )}
    >
      <CardContent className="p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-heading text-xl font-bold text-ink">
                {subsidiary.name}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-border",
                  subsidiary.status === "active" && "border-ink text-ink",
                  subsidiary.status === "coming-soon" && "text-muted-foreground",
                  subsidiary.status === "past" && "text-muted-foreground",
                )}
              >
                {subsidiary.status === "active" && "Active"}
                {subsidiary.status === "coming-soon" && "Coming Soon"}
                {subsidiary.status === "past" && "Past"}
              </Badge>
            </div>

            <p className="label-uppercase mb-3">{subsidiary.industry}</p>
            <p className="text-foreground leading-relaxed">
              {subsidiary.description}
            </p>
          </div>

          {subsidiary.url && isActive && (
            <Link
              href={subsidiary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-ink hover:text-gold transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
