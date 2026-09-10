import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Phrase } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Phrase)
  .where(eq(Phrase.wordSlug, sql.placeholder("wordSlug")))
  .prepare("getWordPhrases");

export const getWordPhrases = p.public
  .input(z.object({ wordSlug: z.string() }))
  .handler(async ({ input: { wordSlug } }) => {
    const wordPhrases = await prepare.execute({ wordSlug });
    return { wordPhrases };
  });
