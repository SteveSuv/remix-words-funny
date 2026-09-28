import { Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { LibraryBig } from "lucide-react";
import { orpc } from "~/common/orpcClient";
import {
  isManageBooksModalOpenAtom,
  isSignInModalOpenAtom,
} from "~/common/store";
import { LuIcon } from "~/components/common/LuIcon";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { BookPanelItem } from "./BookPanelItem";

export function BooksPanelList() {
  const allBooksQuery = useQuery(orpc.loader.getAllBooks.queryOptions());
  const starBooksQuery = useQuery(orpc.loader.getStarBooks.queryOptions());
  const { allBooks = [] } = allBooksQuery.data || {};
  const { starBooks = [] } = starBooksQuery.data || {};
  const { isLogin, query: userQuery } = useMyUserInfo();
  const setIsManageBooksModalOpen = useSetAtom(isManageBooksModalOpenAtom);
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);
  const booksBySlug = new Map(allBooks.map((book) => [book.slug, book]));
  const favoriteBooks = starBooks.flatMap((slug) => {
    const book = booksBySlug.get(slug);
    return book ? [book] : [];
  });
  const visibleBooks =
    isLogin && favoriteBooks.length > 0 ? favoriteBooks : allBooks;
  const isLoading =
    allBooksQuery.isLoading ||
    userQuery.isLoading ||
    (isLogin && starBooksQuery.isLoading);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-separator shrink-0 border-b p-2">
        <Button
          fullWidth
          variant="outline"
          onPress={() => {
            if (isLogin) {
              setIsManageBooksModalOpen(true);
            } else {
              setIsSignInModalOpen(true);
            }
          }}
        >
          <LuIcon icon={LibraryBig} />
          管理书籍
        </Button>
      </div>

      <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div className="flex h-18 items-center gap-3 px-2" key={index}>
                <Skeleton className="h-14 w-9 rounded-sm" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-sm" />
                  <Skeleton className="h-3 w-1/3 rounded-sm" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))
          : visibleBooks.map((book) => (
              <BookPanelItem key={book.id} item={book} />
            ))}
      </div>
    </div>
  );
}
