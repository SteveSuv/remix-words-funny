import { eq, sql } from "drizzle-orm";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";

const prepare = db
  .select({
    bookSlug: UsersToBooks.bookSlug,
  })
  .from(UsersToBooks)
  .where(eq(UsersToBooks.userId, sql.placeholder("userId")))
  .prepare("prepare");

export const getStarBooks = p.public.query(async ({ ctx: { userId } }) => {
  if (!userId) return { starBooks: [] };
  const starBooks = await prepare.execute({ userId });
  return { starBooks: starBooks.map(({ bookSlug }) => bookSlug) };
});
