import { Skeleton } from "@heroui/react";

export const SkeletonBox = () => {
  return (
    <div className="my-1 flex w-full flex-col gap-2">
      <Skeleton className="bg-foreground-200 h-3 w-3/5" />
      <Skeleton className="bg-foreground-200 h-3 w-4/5" />
      <Skeleton className="bg-foreground-200 h-3 w-2/5" />
    </div>
  );
};
