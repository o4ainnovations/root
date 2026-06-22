import { Skeleton } from "@/components/ui/skeleton";

export default function InvestorsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="page-header space-y-4 mb-12">
        <Skeleton className="h-12 w-80 bg-paper-shadow" />
        <Skeleton className="h-5 w-96 bg-paper-shadow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-56 bg-paper-shadow" />
              <Skeleton className="h-5 w-full bg-paper-shadow" />
              <Skeleton className="h-5 w-3/4 bg-paper-shadow" />
            </div>
          ))}
        </div>

        <div className="card-depth-1 p-6 space-y-3 h-fit">
          <Skeleton className="h-5 w-32 bg-paper-shadow" />
          <Skeleton className="h-4 w-full bg-paper-shadow" />
        </div>
      </div>
    </div>
  );
}
