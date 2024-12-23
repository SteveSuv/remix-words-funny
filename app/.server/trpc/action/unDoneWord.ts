import { z } from "zod";
import { db } from "~/.server/db";
import { UsersToWords } from "~/.server/db/schema";
import { p } from "..";
import { and, eq } from "drizzle-orm";

export const unDoneWord = p.auth
  .input(z.object({ wordSlug: z.string() }))
  .mutation(async ({ ctx: { userId }, input: { wordSlug } }) => {
    await db
      .delete(UsersToWords)
      .where(
        and(
          eq(UsersToWords.userId, userId!),
          eq(UsersToWords.wordSlug, wordSlug),
        ),
      );
  });
