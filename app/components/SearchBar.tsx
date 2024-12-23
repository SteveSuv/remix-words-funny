import { Input } from "@nextui-org/react";
import { LuIcon } from "./LuIcon";
import { Search } from "lucide-react";
import { atom, useAtom } from "jotai";

export const searchWordAtom = atom("");

export const SearchBar = () => {
  const [searchWord, setSearchWord] = useAtom(searchWordAtom);

  return (
    <Input
      startContent={
        <LuIcon size={20} className="text-foreground-500" icon={Search} />
      }
      placeholder="全站搜索"
      autoComplete="off"
      className="w-1/2"
      classNames={{
        input: "text-medium",
      }}
      value={searchWord}
      onChange={(e) => setSearchWord(e.target.value)}
    />
  );
};
