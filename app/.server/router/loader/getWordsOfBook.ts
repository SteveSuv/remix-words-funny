import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToWords, Word } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

const getWordsOfBookWithProgressPrepare = db
  .select({
    Word,
    isDone: sql<boolean>`${UsersToWords.userId} is not null`,
  })
  .from(Word)
  .leftJoin(
    UsersToWords,
    and(
      eq(UsersToWords.wordSlug, Word.slug),
      eq(UsersToWords.userId, sql.placeholder("userId")),
    ),
  )
  .where(eq(Word.bookSlug, sql.placeholder("bookSlug")))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .orderBy(Word.id)
  .prepare("getWordsOfBookWithProgress");

const getWordsOfBookPrepare = db
  .select({ Word, isDone: sql<boolean>`false` })
  .from(Word)
  .where(eq(Word.bookSlug, sql.placeholder("bookSlug")))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .orderBy(Word.id)
  .prepare("getWordsOfBook");

export const getWordsOfBook = p.public
  .input(
    z.object({
      bookSlug: z.string(),
      cursor: z.number().int().default(0),
    }),
  )
  .handler(async ({ context: { userId }, input: { bookSlug, cursor } }) => {
    const rows = await (
      userId ? getWordsOfBookWithProgressPrepare : getWordsOfBookPrepare
    ).execute({
      bookSlug,
      userId: userId ?? 0,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE + 1,
    });

    const wordsOfBook = rows.slice(0, PAGE_SIZE);
    const nextCursor = rows.length > PAGE_SIZE ? cursor + 1 : undefined;

    return { wordsOfBook, nextCursor };
  });
