import { count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";

const prepare = db
  .select({ postVotesCount: count() })
  .from(UsersToPostsVote)
  .where(eq(UsersToPostsVote.postId, sql.placeholder("postId")))
  .prepare("getPostVote");

export const getPostVote = p.public
  .input(
    z.object({
      postId: z.number().int(),
    }),
  )
  .handler(async ({ input: { postId } }) => {
    const [{ postVotesCount }] = await prepare.execute({ postId });
    return { postVotesCount };
  });
