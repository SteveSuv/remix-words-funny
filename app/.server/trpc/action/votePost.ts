import { db } from "~/.server/db";
import { p } from "~/.server/trpc";
import { UsersToPostsVote } from "~/.server/db/schema";
import { z } from "zod";

export const votePost = p.auth
  .input(z.object({ postId: z.number().int() }))
  .mutation(async ({ ctx: { userId }, input: { postId } }) => {
    await db.insert(UsersToPostsVote).values({ userId: userId!, postId });
  });
