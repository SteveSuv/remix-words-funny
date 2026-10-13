import { Button, Skeleton } from "@heroui/react";
import type { ReactNode } from "react";

export function HeaderIconButton({
  ariaLabel,
  children,
  isLoading,
  onPress,
}: {
  ariaLabel: string;
  children: ReactNode;
  isLoading: boolean;
  onPress: () => void;
}) {
  if (isLoading) {
    return (
      <Skeleton aria-hidden="true" className="size-10 shrink-0 rounded-full" />
    );
  }

  return (
    <Button
      isIconOnly
      aria-label={ariaLabel}
      className="relative size-10 shrink-0 rounded-full"
      onPress={onPress}
      size="md"
      variant="outline"
    >
      {children}
    </Button>
  );
}
