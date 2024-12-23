import { BookPanelItem, IBookItem } from "./BookPanelItem";

export const BooksPanel = ({ allBooks }: { allBooks: IBookItem[] }) => {
  return (
    <>
      {allBooks.map((e) => {
        return <BookPanelItem key={e.id} item={e} />;
      })}
    </>
  );
};
