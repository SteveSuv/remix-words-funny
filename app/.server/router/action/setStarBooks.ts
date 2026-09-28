import { and, asc, eq, notInArray } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";

export const setStarBooks = p.auth
  .input(
    z.object({
      bookSlugs: z.array(z.string().min(1)).max(100),
    }),
  )
  .handler(async ({ context: { userId }, input: { bookSlugs } }) => {
    const uniqueBookSlugs = [...new Set(bookSlugs)];

    const starBooks = await db.transaction(async (tx) => {
      const userFilter = eq(UsersToBooks.userId, userId!);

      if (uniqueBookSlugs.length === 0) {
        await tx.delete(UsersToBooks).where(userFilter);
      } else {
        await tx
          .delete(UsersToBooks)
          .where(
            and(userFilter, notInArray(UsersToBooks.bookSlug, uniqueBookSlugs)),
          );
        await tx
          .insert(UsersToBooks)
          .values(
            uniqueBookSlugs.map((bookSlug) => ({
              userId: userId!,
              bookSlug,
            })),
          )
          .onConflictDoNothing();
      }

      return tx
        .select({ bookSlug: UsersToBooks.bookSlug })
        .from(UsersToBooks)
        .where(userFilter)
        .orderBy(asc(UsersToBooks.createdAt), asc(UsersToBooks.bookSlug));
    });

    return { starBooks: starBooks.map(({ bookSlug }) => bookSlug) };
  });
