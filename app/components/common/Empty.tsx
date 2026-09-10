import { SearchX } from "lucide-react";
import { LuIcon } from "~/components/common/LuIcon";

export function Empty({ label, size = 80 }: { label: string; size?: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted opacity-50">
      <LuIcon icon={SearchX} size={size} />
      <div className="mt-3 text-sm">{label}</div>
    </div>
  );
}
