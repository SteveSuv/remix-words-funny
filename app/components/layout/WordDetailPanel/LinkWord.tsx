import { Link } from "@heroui/react";
import { useSetAtom } from "jotai";
import {
  isSearchBarOpenAtom,
  isWordDetailPanelDrawerOpenAtom,
  searchWordAtom,
} from "~/common/store";

export function LinkWord({ word }: { word: string }) {
  const setSearchWord = useSetAtom(searchWordAtom);
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );
  const setIsSearchBarOpenAtom = useSetAtom(isSearchBarOpenAtom);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {word.split(" ").map((item, index) => (
        <Link
          key={index}
          className="text-accent"
          onPress={() => {
            setSearchWord(
              item
                .trim()
                .toLowerCase()
                .match(/[a-z]+/i)?.[0] || "",
            );
            setIsWordDetailPanelDrawerOpen(false);
            setIsSearchBarOpenAtom(true);
          }}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
