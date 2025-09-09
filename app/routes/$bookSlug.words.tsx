import { useAtomValue } from "jotai";
import { isSearchBarOpenAtom } from "~/common/store";
import { BookWordsList } from "~/components/BookWordsList";
import { ListTabs } from "~/components/ListTabs";
import { OpenMenuButton } from "~/components/OpenMenuButton";
import { SearchBar } from "~/components/SearchBar";
import { SearchButton } from "~/components/SearchButton";
import { SearchWordsList } from "~/components/SearchWordsList";
import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";

export default function PageWords() {
  const { searchWord } = useDebounceSearchWord();
  const isSearchBarOpen = useAtomValue(isSearchBarOpenAtom);

  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-0 left-0 z-10 p-4">
        {isSearchBarOpen ? (
          <SearchBar />
        ) : (
          <div className="flex items-center justify-between">
            <OpenMenuButton />
            <ListTabs />
            <SearchButton />
          </div>
        )}
      </div>
      {searchWord ? <SearchWordsList /> : <BookWordsList />}
    </div>
  );
}
