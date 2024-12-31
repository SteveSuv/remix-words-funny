import { IBookItem } from "~/common/types";
import { BookPanelItem } from "./BookPanelItem";

export const BooksPanel = ({ allBooks }: { allBooks: IBookItem[] }) => {
  return (
    <>
      {allBooks.map((e) => {
        return <BookPanelItem key={e.id} item={e} />;
      })}
    </>
  );
};
