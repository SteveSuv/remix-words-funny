import { eq, like, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Book, Word } from "~/.server/db/schema";

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
      offset: z.number().int().default(0),
      limit: z.number().int().default(20),
    }),
  )
  .query(async ({ input: { keyword, offset, limit } }) => {
    const wordsOfKeyword = await prepare.execute({
      keyword: `%${keyword.trim().toLowerCase()}%`,
      offset,
      limit,
    });

    return { wordsOfKeyword };
  });
