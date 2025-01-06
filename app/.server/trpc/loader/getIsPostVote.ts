import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";
import { p } from "~/.server/trpc";

const prepare = db
  .select()
  .from(UsersToPostsVote)
  .where(
    and(
      eq(UsersToPostsVote.postId, sql.placeholder("postId")),
      eq(UsersToPostsVote.userId, sql.placeholder("userId")),
    ),
  )
  .limit(1)
  .prepare("prepare");

export const getIsPostVote = p.public
  .input(
    z.object({
      postId: z.number().int(),
    }),
  )
  .query(async ({ ctx: { userId }, input: { postId } }) => {
    if (!userId) return { isPostVote: false };

    const [item] = await prepare.execute({ postId, userId });
    return { isPostVote: !!item };
  });
