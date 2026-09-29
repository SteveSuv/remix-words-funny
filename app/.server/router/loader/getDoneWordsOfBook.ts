import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToWords, Word } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

const prepare = db
  .select({
    Word,
    isDone: sql<boolean>`true`,
  })
  .from(Word)
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
  .prepare("getDoneWordsOfBook");

export const getDoneWordsOfBook = p.auth
  .input(
    z.object({
      bookSlug: z.string(),
      cursor: z.number().int().default(0),
    }),
  )
  .handler(async ({ context: { userId }, input: { bookSlug, cursor } }) => {
    const rows = await prepare.execute({
      bookSlug,
      userId,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE + 1,
    });

    const doneWordsOfBook = rows.slice(0, PAGE_SIZE);
    const nextCursor = rows.length > PAGE_SIZE ? cursor + 1 : undefined;

    return { doneWordsOfBook, nextCursor };
  });
