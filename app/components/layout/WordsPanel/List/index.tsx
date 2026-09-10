import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";
import { BookWordsList } from "./BookWordsList";
import { SearchWordsList } from "./SearchWordsList";

export function WordsPanelList() {
  const { searchWord } = useDebounceSearchWord();
  return searchWord ? <SearchWordsList /> : <BookWordsList />;
}
