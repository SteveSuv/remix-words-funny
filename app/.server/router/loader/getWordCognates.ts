import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Cognate } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Cognate)
  .where(eq(Cognate.wordSlug, sql.placeholder("wordSlug")))
  .prepare("prepare");

export const getWordCognates = p.public
  .input(z.object({ wordSlug: z.string() }))
  .query(async ({ input: { wordSlug } }) => {
    const wordCognates = await prepare.execute({ wordSlug });
    return { wordCognates };
  });
