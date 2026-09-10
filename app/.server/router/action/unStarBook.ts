import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";

export const unStarBook = p.auth
  .input(z.object({ bookSlug: z.string() }))
  .handler(async ({ context: { userId }, input: { bookSlug } }) => {
    await db
      .delete(UsersToBooks)
      .where(
        and(
          eq(UsersToBooks.userId, userId!),
          eq(UsersToBooks.bookSlug, bookSlug),
        ),
      );
  });
