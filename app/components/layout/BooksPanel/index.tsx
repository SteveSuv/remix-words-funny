import { BooksPanelHeader } from "./Header";
import { BooksPanelList } from "./List";

export function BooksPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <BooksPanelHeader />
      <BooksPanelList />
    </div>
  );
}
