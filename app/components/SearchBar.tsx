import { Input } from "@heroui/react";
import { useAtom } from "jotai";
import { Search } from "lucide-react";
import { searchWordAtom } from "~/common/store";
import { CloseSearchBarButton } from "./CloseSearchBarButton";
import { LuIcon } from "./LuIcon";

export const SearchBar = () => {
  const [searchWord, setSearchWord] = useAtom(searchWordAtom);

  return (
    <div className="flex items-center gap-2">
      <Input
        startContent={
          <LuIcon size={20} className="text-foreground-500" icon={Search} />
        }
        placeholder="全站搜索"
        autoComplete="off"
        autoFocus
        classNames={{
          input: "text-medium",
        }}
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <CloseSearchBarButton />
    </div>
  );
};
