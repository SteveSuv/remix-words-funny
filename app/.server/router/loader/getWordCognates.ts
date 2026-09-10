import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Cognate } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Cognate)
  .where(eq(Cognate.wordSlug, sql.placeholder("wordSlug")))
  .prepare("getWordCognates");

export const getWordCognates = p.public
  .input(z.object({ wordSlug: z.string() }))
  .handler(async ({ input: { wordSlug } }) => {
    const wordCognates = await prepare.execute({ wordSlug });
    return { wordCognates };
  });
