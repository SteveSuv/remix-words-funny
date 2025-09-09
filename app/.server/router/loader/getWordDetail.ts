import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Book, Word } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Word)
  .where(eq(Word.slug, sql.placeholder("wordSlug")))
  .innerJoin(Book, eq(Book.slug, Word.bookSlug))
  .limit(1)
  .prepare("prepare");

export const getWordDetail = p.public
  .input(z.object({ wordSlug: z.string() }))
  .query(async ({ input: { wordSlug } }) => {
    const [wordDetail] = await prepare.execute({ wordSlug });
    return { wordDetail };
  });
