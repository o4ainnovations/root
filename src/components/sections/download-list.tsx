import Link from "next/link";
import { FileText } from "lucide-react";
import type { Download } from "@/types";

const categoryLabels: Record<string, string> = {
  investor: "Investor Relations",
  esg: "ESG & Sustainability",
  governance: "Governance",
};

export function DownloadList({ downloads }: { downloads: Download[] }) {
  const grouped = downloads.reduce(
    (acc, d) => {
      const cat = d.category || "investor";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(d);
      return acc;
    },
    {} as Record<string, Download[]>,
  );

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
            {categoryLabels[category] || category}
          </h3>
          <div className="space-y-1">
            {items.map((d) => (
              <Link
                key={d._id}
                href={d.file.asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 hover:bg-paper-highlight transition-colors group"
              >
                <FileText className="h-4 w-4 text-ink flex-shrink-0" />
                <span className="font-serif text-foreground group-hover:text-ink transition-colors flex-1">
                  {d.title}
                </span>
                <span className="label-uppercase">
                  {new Date(d.publishDate).getFullYear()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
