import { LuIcon } from "~/components/LuIcon";
import { SearchX } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <LuIcon size={100} className="text-foreground-300" icon={SearchX} />
      <div className="mt-2 text-foreground-400">页面不存在</div>
    </div>
  );
}
