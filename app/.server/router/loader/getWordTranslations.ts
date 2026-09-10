import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Translation } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Translation)
  .where(eq(Translation.wordSlug, sql.placeholder("wordSlug")))
  .prepare("getWordTranslations");

export const getWordTranslations = p.public
  .input(z.object({ wordSlug: z.string() }))
  .handler(async ({ input: { wordSlug } }) => {
    const wordTranslations = await prepare.execute({
      wordSlug,
    });

    return { wordTranslations };
  });
