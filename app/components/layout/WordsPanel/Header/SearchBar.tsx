import { Button, SearchField } from "@heroui/react";
import { useAtom, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { isSearchBarOpenAtom, searchWordAtom } from "~/common/store";
import { LuIcon } from "~/components/common/LuIcon";

export function SearchBar() {
  const [searchWord, setSearchWord] = useAtom(searchWordAtom);
  const setIsSearchBarOpen = useSetAtom(isSearchBarOpenAtom);

  return (
    <div className="flex h-full items-center gap-4">
      <SearchField
        autoFocus
        fullWidth
        value={searchWord}
        onChange={setSearchWord}
      >
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="全站搜索" autoComplete="off" />
        </SearchField.Group>
      </SearchField>
      <Button
        isIconOnly
        variant="outline"
        onPress={() => {
          setSearchWord("");
          setIsSearchBarOpen(false);
        }}
      >
        <LuIcon icon={X} />
      </Button>
    </div>
  );
}
