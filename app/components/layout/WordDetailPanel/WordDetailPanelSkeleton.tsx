import { Skeleton } from "@heroui/react";

export function WordDetailPanelSkeleton() {
  return (
    <div className="space-y-5 p-4">
      <div className="space-y-3">
        <Skeleton className="h-12 w-52 rounded-sm" />
        <Skeleton className="h-4 w-36 rounded-sm" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-md" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="space-y-3" key={index}>
          <Skeleton className="h-5 w-24 rounded-sm" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
