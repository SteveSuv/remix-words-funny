import { Skeleton } from "@nextui-org/react";

export const SkeletonBox = () => {
  return (
    <div className="my-1 flex w-full flex-col gap-2">
      <Skeleton className="h-3 w-3/5 bg-foreground-200" />
      <Skeleton className="h-3 w-4/5 bg-foreground-200" />
      <Skeleton className="h-3 w-2/5 bg-foreground-200" />
    </div>
  );
};
