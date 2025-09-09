import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";

export const votePost = p.auth
  .input(z.object({ postId: z.number().int() }))
  .mutation(async ({ ctx: { userId }, input: { postId } }) => {
    await db.insert(UsersToPostsVote).values({ userId: userId!, postId });
  });
