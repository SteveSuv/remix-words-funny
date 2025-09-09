import { and, asc, eq, notInArray, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToWords, Word } from "~/.server/db/schema";

const prepare = db
  .select({ Word })
  .from(Word)
  .where(
    and(
      notInArray(
        Word.slug,
        db
          .select({ wordSlug: UsersToWords.wordSlug })
          .from(UsersToWords)
          .where(eq(UsersToWords.userId, sql.placeholder("userId"))),
      ),
      eq(Word.bookSlug, sql.placeholder("bookSlug")),
    ),
  )
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .orderBy(asc(Word.id))
  .prepare("prepare");

export const getUnDoneWordsOfBook = p.auth
  .input(
    z.object({
      bookSlug: z.string(),
      offset: z.number().int().default(0),
      limit: z.number().int().default(20),
    }),
  )
  .query(async ({ ctx: { userId }, input: { bookSlug, offset, limit } }) => {
    const unDoneWordsOfBook = await prepare.execute({
      bookSlug,
      userId,
      limit,
      offset,
    });

    return { unDoneWordsOfBook };
  });
