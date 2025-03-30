import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";
import { SearchWordsList } from "~/components/SearchWordsList";
import { BookWordsList } from "~/components/BookWordsList";
import { SearchBar } from "~/components/SearchBar";
import { ListTabs } from "~/components/ListTabs";

export default function PageWords() {
  const { searchWord } = useDebounceSearchWord();

  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-0 left-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <ListTabs />
          <SearchBar />
        </div>
      </div>
      {searchWord ? <SearchWordsList /> : <BookWordsList />}
    </div>
  );
}
