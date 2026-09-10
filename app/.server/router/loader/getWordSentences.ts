import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Sentence } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Sentence)
  .where(eq(Sentence.wordSlug, sql.placeholder("wordSlug")))
  .prepare("getWordSentences");

export const getWordSentences = p.public
  .input(z.object({ wordSlug: z.string() }))
  .handler(async ({ input: { wordSlug } }) => {
    const wordSentences = await prepare.execute({
      wordSlug,
    });

    return { wordSentences };
  });
