import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Word } from "~/.server/db/schema";

const prepare = db
  .select({ Word })
  .from(Word)
  .where(eq(Word.bookSlug, sql.placeholder("bookSlug")))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .orderBy(Word.id)
  .prepare("prepare");

export const getWordsOfBook = p.public
  .input(
    z.object({
      bookSlug: z.string(),
      offset: z.number().int().default(0),
      limit: z.number().int().default(20),
    }),
  )
  .query(async ({ input: { bookSlug, offset, limit } }) => {
    const wordsOfBook = await prepare.execute({
      bookSlug,
      offset,
      limit,
    });

    return { wordsOfBook };
  });
