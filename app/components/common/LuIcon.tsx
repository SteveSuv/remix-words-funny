import type { LucideIcon, LucideProps } from "lucide-react";

export function LuIcon({
  icon: Icon,
  className,
  size,
  strokeWidth,
  ...props
}: LucideProps & { icon: LucideIcon }) {
  const resolvedSize = size || 18;

  return (
    <Icon
      {...props}
      className={className}
      size={resolvedSize}
      strokeWidth={strokeWidth || 1.5}
    />
  );
}
