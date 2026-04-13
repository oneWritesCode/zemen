import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12">
      <Skeleton className="h-10 w-48 rounded-full" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}
