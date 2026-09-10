import { Separator, Skeleton } from "@heroui/react";

export function WordDetailSectionSkeleton() {
  return (
    <div className="space-y-3">
      <Separator />
      <Skeleton className="h-5 w-24 rounded-sm" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
