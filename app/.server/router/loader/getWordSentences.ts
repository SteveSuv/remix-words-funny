import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Sentence } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Sentence)
  .where(eq(Sentence.wordSlug, sql.placeholder("wordSlug")))
  .prepare("prepare");

export const getWordSentences = p.public
  .input(z.object({ wordSlug: z.string() }))
  .query(async ({ input: { wordSlug } }) => {
    const wordSentences = await prepare.execute({
      wordSlug,
    });

    return { wordSentences };
  });
