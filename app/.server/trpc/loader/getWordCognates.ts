import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/.server/db";
import { Cognate } from "~/.server/db/schema";
import { p } from "~/.server/trpc";

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
