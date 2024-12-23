import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";
import { p } from "~/.server/trpc";

const prepare = db
  .select()
  .from(UsersToBooks)
  .where(
    and(
      eq(UsersToBooks.bookSlug, sql.placeholder("bookSlug")),
      eq(UsersToBooks.userId, sql.placeholder("userId")),
    ),
  )
  .limit(1)
  .prepare("prepare");

export const getIsBookStar = p.public
  .input(z.object({ bookSlug: z.string() }))
  .query(async ({ ctx: { userId }, input: { bookSlug } }) => {
    if (!userId) return { isBookStar: false };

    const [item] = await prepare.execute({ bookSlug, userId });

    return { isBookStar: !!item };
  });
