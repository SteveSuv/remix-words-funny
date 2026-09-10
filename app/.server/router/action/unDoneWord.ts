import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToWords } from "~/.server/db/schema";

export const unDoneWord = p.auth
  .input(z.object({ wordSlug: z.string() }))
  .handler(async ({ context: { userId }, input: { wordSlug } }) => {
    await db
      .delete(UsersToWords)
      .where(
        and(
          eq(UsersToWords.userId, userId!),
          eq(UsersToWords.wordSlug, wordSlug),
        ),
      );
  });
