import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/.server/db";
import { UsersToWords } from "~/.server/db/schema";
import { p } from "~/.server/trpc";

const prepare = db
  .select()
  .from(UsersToWords)
  .where(
    and(
      eq(UsersToWords.wordSlug, sql.placeholder("wordSlug")),
      eq(UsersToWords.userId, sql.placeholder("userId")),
    ),
  )
  .limit(1)
  .prepare("prepare");

export const getIsWordDone = p.public
  .input(z.object({ wordSlug: z.string() }))
  .query(async ({ ctx: { userId }, input: { wordSlug } }) => {
    if (!userId) return { isWordDone: false };

    const [item] = await prepare.execute({ wordSlug, userId });

    return { isWordDone: !!item };
  });
