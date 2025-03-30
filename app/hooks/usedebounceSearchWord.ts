import { useAtom } from "jotai";
import { useDebounceValue } from "usehooks-ts";
import { searchWordAtom } from "~/components/SearchBar";

export const useDebounceSearchWord = () => {
  const [_searchWord] = useAtom(searchWordAtom);
  const [debounceSearchWord] = useDebounceValue(_searchWord, 300);
  const searchWord = debounceSearchWord.trim().toLowerCase();

  return { searchWord };
};
