import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(UsersToPostsVote)
  .where(eq(UsersToPostsVote.postId, sql.placeholder("postId")))
  .prepare("prepare");

export const getPostVote = p.public
  .input(
    z.object({
      postId: z.number().int(),
    }),
  )
  .query(async ({ input: { postId } }) => {
    const postVotes = await prepare.execute({ postId });
    return { postVotesCount: postVotes.length };
  });
