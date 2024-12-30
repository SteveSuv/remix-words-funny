import { ReactNode } from "react";
import { BooksPanel } from "./BooksPanel";
import { WordDetailPanel } from "./WordDetailPanel";
import { AppHeader } from "./AppHeader";

type IAllBooks = {
  id: number;
  slug: string;
  cover: string;
  name: string;
  wordsCount: number;
}[];

export const AppLayout = ({
  allBooks,
  children,
}: {
  allBooks: IAllBooks;
  children: ReactNode;
}) => {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="h-screen w-[350px] bg-foreground-50 shadow-small">
        <AppHeader />
        <div className="h-[calc(100vh-80px)] overflow-y-scroll">
          <BooksPanel allBooks={allBooks} />
        </div>
      </div>

      <div className="flex flex-1">{children}</div>

      <div className="h-screen w-[400px] overflow-y-scroll bg-foreground-50 shadow-small">
        <WordDetailPanel />
      </div>
    </main>
  );
};
