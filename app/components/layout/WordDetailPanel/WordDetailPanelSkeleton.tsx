import { Skeleton } from "@heroui/react";

export function WordDetailPanelSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Skeleton className="h-12 w-52 rounded-sm" />
        <Skeleton className="h-4 w-36 rounded-sm" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
}
