import { eq } from "drizzle-orm";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Book, Word } from "~/.server/db/schema";

const prepare = db
  .select({
    id: Book.id,
    slug: Book.slug,
    cover: Book.cover,
    name: Book.name,
    wordsCount: db.$count(Word, eq(Word.bookSlug, Book.slug)),
  })
  .from(Book)
  .groupBy(Book.id)
  .prepare("prepare");

export const getAllBooks = p.public.query(async () => {
  const allBooks = await prepare.execute();
  return { allBooks };
});
