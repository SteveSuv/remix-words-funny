import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Post, User } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

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
      cursor: z.number().int().default(0),
    }),
  )
  .query(async ({ input: { wordSlug, cursor } }) => {
    const wordComments = await prepare.execute({
      wordSlug,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE,
    });

    const nextCursor = wordComments.length ? cursor + 1 : undefined;

    return { wordComments, nextCursor };
  });
