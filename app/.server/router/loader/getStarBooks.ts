import { eq, sql } from "drizzle-orm";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";

const prepare = db
  .select({
    bookSlug: UsersToBooks.bookSlug,
  })
  .from(UsersToBooks)
  .where(eq(UsersToBooks.userId, sql.placeholder("userId")))
  .prepare("getStarBooks");

export const getStarBooks = p.public.handler(
  async ({ context: { userId } }) => {
    if (!userId) return { starBooks: [] };
    const starBooks = await prepare.execute({ userId });
    return { starBooks: starBooks.map(({ bookSlug }) => bookSlug) };
  },
);
