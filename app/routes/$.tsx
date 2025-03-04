import { LuIcon } from "~/components/LuIcon";
import { SearchX } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <LuIcon size={100} className="text-foreground-300" icon={SearchX} />
      <div className="text-foreground-400 mt-2">页面不存在</div>
    </div>
  );
}
