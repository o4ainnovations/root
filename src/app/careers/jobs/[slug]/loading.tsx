import { Skeleton } from "@/components/ui/skeleton";

export default function JobDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="page-header space-y-4">
        <Skeleton className="h-4 w-32 bg-paper-shadow" />
        <Skeleton className="h-12 w-96 bg-paper-shadow" />
        <Skeleton className="h-4 w-80 bg-paper-shadow" />
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-4 w-full bg-paper-shadow" />
        <Skeleton className="h-4 w-5/6 bg-paper-shadow" />
        <Skeleton className="h-4 w-3/4 bg-paper-shadow" />
        <Skeleton className="h-4 w-full bg-paper-shadow" />
        <Skeleton className="h-4 w-2/3 bg-paper-shadow" />
      </div>
    </div>
  );
}
