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
    ...allBooks.filter(({ slug }) => starBooks.includes(slug)),
    ...allBooks.filter(({ slug }) => !starBooks.includes(slug)),
  ];

  return (
    <>
      {booksList.map((e) => (
        <BookPanelItem
          key={e.id}
          item={e}
          isBookStar={starBooks.includes(e.slug)}
        />
      ))}
    </>
  );
};
