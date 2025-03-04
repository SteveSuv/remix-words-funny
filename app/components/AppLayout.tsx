import { ReactNode } from "react";
import { BooksPanel } from "./BooksPanel";
import { WordDetailPanel } from "./WordDetailPanel";
import { AppHeader } from "./AppHeader";
import { IBookItem } from "~/common/types";

export const AppLayout = ({
  allBooks,
  children,
}: {
  allBooks: IBookItem[];
  children: ReactNode;
}) => {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="bg-foreground-50 shadow-small h-screen w-[350px]">
        <AppHeader />
        <div className="h-[calc(100vh-80px)] overflow-y-scroll">
          <BooksPanel allBooks={allBooks} />
        </div>
      </div>

      <div className="flex flex-1">{children}</div>

      <div className="bg-foreground-50 shadow-small h-screen w-[400px] overflow-y-scroll">
        <WordDetailPanel />
      </div>
    </main>
  );
};
