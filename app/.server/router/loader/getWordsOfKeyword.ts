import { eq, like, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Book, Word } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

const prepare = db
  .select()
  .from(Word)
  .where(like(Word.word, sql.placeholder("keyword")))
  .innerJoin(Book, eq(Book.slug, Word.bookSlug))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .prepare("prepare");

export const getWordsOfKeyword = p.public
  .input(
    z.object({
      keyword: z.string(),
      cursor: z.number().int().default(0),
    }),
  )
  .query(async ({ input: { keyword, cursor } }) => {
    const wordsOfKeyword = await prepare.execute({
      keyword: `%${keyword.trim().toLowerCase()}%`,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE,
    });

    const nextCursor = wordsOfKeyword.length ? cursor + 1 : undefined;

    return { wordsOfKeyword, nextCursor };
  });
