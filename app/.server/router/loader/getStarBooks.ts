import { asc, eq, sql } from "drizzle-orm";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";

const getStarBooksPrepare = db
  .select({
    bookSlug: UsersToBooks.bookSlug,
  })
  .from(UsersToBooks)
  .where(eq(UsersToBooks.userId, sql.placeholder("userId")))
  .orderBy(asc(UsersToBooks.createdAt), asc(UsersToBooks.bookSlug))
  .prepare("getStarBooks");

export async function getStarBookSlugs(userId: number) {
  const starBooks = await getStarBooksPrepare.execute({ userId });
  return starBooks.map(({ bookSlug }) => bookSlug);
}

export const getStarBooks = p.public.handler(
  async ({ context: { userId } }) => {
    if (!userId) return { starBooks: [] };
    return { starBooks: await getStarBookSlugs(userId) };
  },
);
