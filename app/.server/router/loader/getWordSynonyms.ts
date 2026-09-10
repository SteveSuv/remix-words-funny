import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Synonym } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Synonym)
  .where(eq(Synonym.wordSlug, sql.placeholder("wordSlug")))
  .prepare("getWordSynonyms");

export const getWordSynonyms = p.public
  .input(z.object({ wordSlug: z.string() }))
  .handler(async ({ input: { wordSlug } }) => {
    const wordSynonyms = await prepare.execute({ wordSlug });

    return { wordSynonyms };
  });
