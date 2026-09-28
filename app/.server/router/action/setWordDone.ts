import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToWords } from "~/.server/db/schema";

export const setWordDone = p.auth
  .input(
    z.object({
      wordSlug: z.string(),
      isDone: z.boolean(),
    }),
  )
  .handler(async ({ context: { userId }, input: { wordSlug, isDone } }) => {
    if (isDone) {
      await db
        .insert(UsersToWords)
        .values({ userId: userId!, wordSlug })
        .onConflictDoNothing();
      return;
    }

    await db
      .delete(UsersToWords)
      .where(
        and(
          eq(UsersToWords.userId, userId!),
          eq(UsersToWords.wordSlug, wordSlug),
        ),
      );
  });
