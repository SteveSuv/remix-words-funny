import { Input } from "@heroui/react";
import { LuIcon } from "./LuIcon";
import { Search } from "lucide-react";
import { useAtom } from "jotai";
import { searchWordAtom } from "~/common/store";
import { CloseSearchBarButton } from "./CloseSearchBarButton";

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
