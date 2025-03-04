import { useSetAtom } from "jotai";
import { searchWordAtom } from "./SearchBar";

export const LinkWord = ({ word }: { word: string }) => {
  const setSearchWord = useSetAtom(searchWordAtom);

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
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
