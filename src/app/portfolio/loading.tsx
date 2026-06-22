import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-8">
      <div className="page-header space-y-4">
        <Skeleton className="h-12 w-56 bg-paper-shadow" />
        <Skeleton className="h-5 w-96 bg-paper-shadow" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-depth-2 p-8 space-y-3">
            <Skeleton className="h-7 w-64 bg-paper-shadow" />
            <Skeleton className="h-4 w-40 bg-paper-shadow" />
            <Skeleton className="h-20 w-full bg-paper-shadow" />
          </div>
        ))}
      </div>
    </div>
  );
}
