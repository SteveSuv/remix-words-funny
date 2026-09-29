import { count, eq } from "drizzle-orm";
import { p } from "~/.server/common/orpc";
import { QueryClient } from "@tanstack/react-query";
import { db } from "~/.server/db";
import { Book, Word } from "~/.server/db/schema";

const getAllBooksPrepare = db
  .select({
    id: Book.id,
    slug: Book.slug,
    cover: Book.cover,
    name: Book.name,
    wordsCount: count(Word.id),
  })
  .from(Book)
  .leftJoin(Word, eq(Word.bookSlug, Book.slug))
  .groupBy(Book.id, Book.slug, Book.cover, Book.name)
  .prepare("getAllBooks");

const bookCatalogQueryClient = new QueryClient();

export const getAllBooks = p.public.handler(async () => {
  const allBooks = await bookCatalogQueryClient.query({
    queryKey: ["allBooks"],
    queryFn: () => getAllBooksPrepare.execute(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return { allBooks };
});
