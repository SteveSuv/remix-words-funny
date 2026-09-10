import { useAtomValue } from "jotai";
import { useDebounceValue } from "usehooks-ts";
import { searchWordAtom } from "~/common/store";

export function useDebounceSearchWord() {
  const _searchWord = useAtomValue(searchWordAtom);
  const [debounceSearchWord] = useDebounceValue(_searchWord, 300);
  const searchWord = debounceSearchWord.trim().toLowerCase();
  return { searchWord };
}
