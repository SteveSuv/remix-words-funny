import { BooksPanelHeader } from "./Header";
import { BooksPanelList } from "./List";

export function BooksPanel() {
  return (
    <div>
      <BooksPanelHeader />
      <BooksPanelList />
    </div>
  );
}
