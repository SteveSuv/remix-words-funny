import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";

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
