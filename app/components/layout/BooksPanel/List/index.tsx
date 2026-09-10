import { Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "~/common/orpcClient";
import { BookPanelItem } from "./BookPanelItem";

export function BooksPanelList() {
  const allBooksQuery = useQuery(orpc.loader.getAllBooks.queryOptions());
  const starBooksQuery = useQuery(orpc.loader.getStarBooks.queryOptions());
  const { allBooks = [] } = allBooksQuery.data || {};
  const { starBooks = [] } = starBooksQuery.data || {};

  if (allBooksQuery.isLoading) {
    return (
      <div className="h-[calc(100vh-4.5rem)] space-y-3 overflow-y-auto p-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="flex h-16 items-center gap-3 px-2" key={index}>
            <Skeleton className="h-12 w-8 rounded-sm" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-sm" />
              <Skeleton className="h-3 w-1/3 rounded-sm" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4.5rem)] overflow-y-auto p-2">
      {allBooks.map((e) => (
        <BookPanelItem
          key={e.id}
          item={e}
          isBookStar={starBooks.includes(e.slug)}
        />
      ))}
    </div>
  );
}
