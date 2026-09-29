import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToWords } from "~/.server/db/schema";

const addWordDonePrepare = db
  .insert(UsersToWords)
  .values({
    userId: sql.placeholder("userId"),
    wordSlug: sql.placeholder("wordSlug"),
  })
  .onConflictDoNothing()
  .prepare("setWordDone.add");

const removeWordDonePrepare = db
  .delete(UsersToWords)
  .where(
    and(
      eq(UsersToWords.userId, sql.placeholder("userId")),
      eq(UsersToWords.wordSlug, sql.placeholder("wordSlug")),
    ),
  )
  .prepare("setWordDone.remove");

export const setWordDone = p.auth
  .input(
    z.object({
      wordSlug: z.string(),
      isDone: z.boolean(),
    }),
  )
  .handler(async ({ context: { userId }, input: { wordSlug, isDone } }) => {
    if (isDone) {
      await addWordDonePrepare.execute({
        userId,
        wordSlug,
      });
      return;
    }

    await removeWordDonePrepare.execute({ userId, wordSlug });
  });
