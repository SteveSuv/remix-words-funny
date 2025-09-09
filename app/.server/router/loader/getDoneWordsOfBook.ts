import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Book, UsersToWords, Word } from "~/.server/db/schema";

const prepare = db
  .select({ Word })
  .from(Word)
  .innerJoin(Book, eq(Book.slug, Word.bookSlug))
  .innerJoin(UsersToWords, eq(UsersToWords.wordSlug, Word.slug))
  .where(
    and(
      eq(Word.bookSlug, sql.placeholder("bookSlug")),
      eq(UsersToWords.userId, sql.placeholder("userId")),
    ),
  )
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .orderBy(Word.id)
  .prepare("prepare");

export const getDoneWordsOfBook = p.auth
  .input(
    z.object({
      bookSlug: z.string(),
      offset: z.number().int().default(0),
      limit: z.number().int().default(20),
    }),
  )
  .query(async ({ ctx: { userId }, input: { bookSlug, offset, limit } }) => {
    const doneWordsOfBook = await prepare.execute({
      bookSlug,
      userId,
      limit,
      offset,
    });

    return { doneWordsOfBook };
  });
