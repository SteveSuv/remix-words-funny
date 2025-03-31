import { useSetAtom } from "jotai";
import {
  isSearchBarOpenAtom,
  isWordDetailPanelDrawerOpenAtom,
  searchWordAtom,
} from "~/common/store";

export const LinkWord = ({ word }: { word: string }) => {
  const setSearchWord = useSetAtom(searchWordAtom);
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );
  const setIsSearchBarOpenAtom = useSetAtom(isSearchBarOpenAtom);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {word.split(" ").map((item, index) => {
        return (
          <div
            className="text-primary cursor-pointer hover:underline"
            key={index}
            onClick={() => {
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
          </div>
        );
      })}
    </div>
  );
};
