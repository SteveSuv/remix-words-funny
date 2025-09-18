import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Book, UsersToWords, Word } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

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
      cursor: z.number().int().default(0),
    }),
  )
  .query(async ({ ctx: { userId }, input: { bookSlug, cursor } }) => {
    const doneWordsOfBook = await prepare.execute({
      bookSlug,
      userId,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE,
    });

    const nextCursor = doneWordsOfBook.length ? cursor + 1 : undefined;

    return { doneWordsOfBook, nextCursor };
  });
