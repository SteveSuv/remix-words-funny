import { IBookItem } from "~/common/types";
import { BookPanelItem } from "./BookPanelItem";

export const BooksPanel = ({
  allBooks,
  starBooks,
}: {
  allBooks: IBookItem[];
  starBooks: string[];
}) => {
  const booksList = [
    ...allBooks.filter((e) => starBooks.includes(e.slug)),
    ...allBooks.filter((e) => !starBooks.includes(e.slug)),
  ];

  return (
    <>
      {booksList.map((e) => {
        return (
          <BookPanelItem
            key={e.id}
            item={e}
            isBookStar={starBooks.includes(e.slug)}
          />
        );
      })}
    </>
  );
};
