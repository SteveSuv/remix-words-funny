import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/.server/db";
import { Phrase } from "~/.server/db/schema";
import { p } from "~/.server/trpc";

const prepare = db
  .select()
  .from(Phrase)
  .where(eq(Phrase.wordSlug, sql.placeholder("wordSlug")))
  .prepare("prepare");

export const getWordPhrases = p.public
  .input(z.object({ wordSlug: z.string() }))
  .query(async ({ input: { wordSlug } }) => {
    const wordPhrases = await prepare.execute({ wordSlug });
    return { wordPhrases };
  });
