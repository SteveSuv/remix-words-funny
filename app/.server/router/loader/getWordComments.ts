import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Post, User } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(Post)
  .where(eq(Post.wordSlug, sql.placeholder("wordSlug")))
  .innerJoin(User, eq(User.id, Post.userId))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .orderBy(desc(Post.id))
  .prepare("prepare");

export const getWordComments = p.public
  .input(
    z.object({
      wordSlug: z.string(),
      offset: z.number().int().default(0),
      limit: z.number().int().default(20),
    }),
  )
  .query(async ({ input: { wordSlug, offset, limit } }) => {
    const wordComments = await prepare.execute({ wordSlug, offset, limit });
    return { wordComments };
  });
