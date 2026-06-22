import Link from "next/link";
import { JsonLd } from "./json-ld";
import { buildBreadcrumbSchema } from "../structured-data";
import type { BreadcrumbItem } from "../types";

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = buildBreadcrumbSchema(items);
  return <JsonLd data={schema} id="breadcrumb-schema" />;
}

export function BreadcrumbNav({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const all = [{ name: "O4A", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-muted-foreground">
        {all.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-hairline">/</span>}
            {i < all.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-ink transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-ink">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
