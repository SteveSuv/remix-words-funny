import { db } from "~/.server/db";
import { p } from "~/.server/trpc";
import { UsersToPostsVote } from "~/.server/db/schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export const unVotePost = p.auth
  .input(z.object({ postId: z.number().int() }))
  .mutation(async ({ ctx: { userId }, input: { postId } }) => {
    await db
      .delete(UsersToPostsVote)
      .where(
        and(
          eq(UsersToPostsVote.userId, userId!),
          eq(UsersToPostsVote.postId, postId),
        ),
      );
  });
