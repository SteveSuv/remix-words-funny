import { db } from "~/.server/db";
import { p } from "~/.server/trpc";
import { count, eq, sql } from "drizzle-orm";
import { Book, UsersToBooks, Word } from "~/.server/db/schema";

const prepareGetAllBooks = db
  .select({
    id: Book.id,
    slug: Book.slug,
    cover: Book.cover,
    name: Book.name,
    wordsCount: count(Word.id),
  })
  .from(Book)
  .leftJoin(Word, eq(Word.bookSlug, Book.slug))
  .groupBy(Book.id)
  .prepare("prepareGetAllBooks");

const prepareGetStarBooks = db
  .select({
    bookSlug: UsersToBooks.bookSlug,
  })
  .from(UsersToBooks)
  .where(eq(UsersToBooks.userId, sql.placeholder("userId")))
  .prepare("prepareGetStarBooks");

export const getAllBooks = p.public.query(async ({ ctx: { userId } }) => {
  const allBooks = await prepareGetAllBooks.execute();

  if (!userId) {
    return { allBooks };
  }

  const starBooks = await prepareGetStarBooks.execute({ userId });

  const starBookSlugs = starBooks.map((e) => e.bookSlug);

  return {
    allBooks: [
      ...allBooks.filter((e) => starBookSlugs.includes(e.slug)),
      ...allBooks.filter((e) => !starBookSlugs.includes(e.slug)),
    ],
  };
});
