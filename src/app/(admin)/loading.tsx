import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="page-header space-y-4">
        <Skeleton className="h-9 w-48 bg-paper-shadow" />
        <Skeleton className="h-5 w-64 bg-paper-shadow" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-depth-1 p-6 space-y-3">
            <Skeleton className="h-8 w-12 bg-paper-shadow" />
            <Skeleton className="h-4 w-24 bg-paper-shadow" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-48 bg-paper-shadow" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-depth-1 p-4 space-y-2">
            <Skeleton className="h-5 w-64 bg-paper-shadow" />
            <Skeleton className="h-4 w-32 bg-paper-shadow" />
          </div>
        ))}
      </div>
    </div>
  );
}
