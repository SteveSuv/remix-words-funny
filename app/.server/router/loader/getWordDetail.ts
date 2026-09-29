import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Book, Word } from "~/.server/db/schema";

const getWordDetailPrepare = db
  .select()
  .from(Word)
  .where(eq(Word.slug, sql.placeholder("wordSlug")))
  .innerJoin(Book, eq(Book.slug, Word.bookSlug))
  .limit(1)
  .prepare("getWordDetail");

export const getWordDetail = p.public
  .input(z.object({ wordSlug: z.string() }))
  .handler(async ({ input: { wordSlug } }) => {
    const [wordDetail] = await getWordDetailPrepare.execute({ wordSlug });
    return { wordDetail };
  });
