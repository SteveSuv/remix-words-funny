import { and, eq, like, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Book, UsersToWords, Word } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

const getWordsOfKeywordWithProgressPrepare = db
  .select({
    Book,
    Word,
    isDone: sql<boolean>`${UsersToWords.userId} is not null`,
  })
  .from(Word)
  .innerJoin(Book, eq(Book.slug, Word.bookSlug))
  .leftJoin(
    UsersToWords,
    and(
      eq(UsersToWords.wordSlug, Word.slug),
      eq(UsersToWords.userId, sql.placeholder("userId")),
    ),
  )
  .where(like(Word.word, sql.placeholder("keyword")))
  .orderBy(Word.id)
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .prepare("getWordsOfKeywordWithProgress");

const getWordsOfKeywordPrepare = db
  .select({ Book, Word, isDone: sql<boolean>`false` })
  .from(Word)
  .innerJoin(Book, eq(Book.slug, Word.bookSlug))
  .where(like(Word.word, sql.placeholder("keyword")))
  .orderBy(Word.id)
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .prepare("getWordsOfKeyword");

export const getWordsOfKeyword = p.public
  .input(
    z.object({
      keyword: z.string(),
      cursor: z.number().int().default(0),
    }),
  )
  .handler(async ({ context: { userId }, input: { keyword, cursor } }) => {
    const rows = await (
      userId ? getWordsOfKeywordWithProgressPrepare : getWordsOfKeywordPrepare
    ).execute({
      keyword: `%${keyword.trim().toLowerCase()}%`,
      userId: userId ?? 0,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE + 1,
    });

    const wordsOfKeyword = rows.slice(0, PAGE_SIZE);
    const nextCursor = rows.length > PAGE_SIZE ? cursor + 1 : undefined;

    return { wordsOfKeyword, nextCursor };
  });
