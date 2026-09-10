import { Button, Surface } from "@heroui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { Menu, Search } from "lucide-react";
import {
  isBooksPanelDrawerOpenAtom,
  isSearchBarOpenAtom,
} from "~/common/store";
import { SearchBar } from "./SearchBar";
import { LuIcon } from "~/components/common/LuIcon";
import { ListTabs } from "./ListTabs";

export function WordsPanelHeader() {
  const isSearchBarOpen = useAtomValue(isSearchBarOpenAtom);
  const setIsBooksPanelDrawerOpen = useSetAtom(isBooksPanelDrawerOpenAtom);
  const setIsSearchBarOpen = useSetAtom(isSearchBarOpenAtom);

  return (
    <Surface className="border-separator sticky top-0 left-0 z-10 h-18 border-b px-4">
      {isSearchBarOpen ? (
        <SearchBar />
      ) : (
        <div className="flex h-full items-center justify-between">
          <div className="flex shrink-0 xl:hidden">
            <Button
              isIconOnly
              variant="outline"
              onPress={() => setIsBooksPanelDrawerOpen(true)}
            >
              <LuIcon icon={Menu} size={24} />
            </Button>
          </div>
          <ListTabs />
          <div className="shrink-0">
            <Button
              isIconOnly
              variant="outline"
              onPress={() => setIsSearchBarOpen(true)}
            >
              <LuIcon icon={Search} size={24} />
            </Button>
          </div>
        </div>
      )}
    </Surface>
  );
}
