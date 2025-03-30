import { ReactNode } from "react";
import { BooksPanel } from "./BooksPanel";
import { WordDetailPanel } from "./WordDetailPanel";
import { AppHeader } from "./AppHeader";
import { IBookItem } from "~/common/types";

export const AppLayout = ({
  allBooks,
  starBooks,
  children,
}: {
  allBooks: IBookItem[];
  starBooks: string[];
  children: ReactNode;
}) => {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="bg-foreground-50 shadow-small h-screen w-[350px]">
        <AppHeader />
        <div className="h-[calc(100vh-80px)] w-[350px] overflow-y-scroll">
          <BooksPanel allBooks={allBooks} starBooks={starBooks} />
        </div>
      </div>

      <div className="flex w-[calc(100vw-350px-400px)]">{children}</div>

      <div className="bg-foreground-50 shadow-small h-screen w-[400px] overflow-y-scroll">
        <WordDetailPanel />
      </div>
    </main>
  );
};
