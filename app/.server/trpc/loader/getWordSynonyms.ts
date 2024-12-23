import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/.server/db";
import { Synonym } from "~/.server/db/schema";
import { p } from "~/.server/trpc";

const prepare = db
  .select()
  .from(Synonym)
  .where(eq(Synonym.wordSlug, sql.placeholder("wordSlug")))
  .prepare("prepare");

export const getWordSynonyms = p.public
  .input(z.object({ wordSlug: z.string() }))
  .query(async ({ input: { wordSlug } }) => {
    const wordSynonyms = await prepare.execute({ wordSlug });

    return { wordSynonyms };
  });
