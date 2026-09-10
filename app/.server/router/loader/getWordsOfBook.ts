import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Word } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

const prepare = db
  .select({ Word })
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
  .handler(async ({ input: { bookSlug, cursor } }) => {
    const wordsOfBook = await prepare.execute({
      bookSlug,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE,
    });

    const nextCursor = wordsOfBook.length ? cursor + 1 : undefined;

    return { wordsOfBook, nextCursor };
  });
