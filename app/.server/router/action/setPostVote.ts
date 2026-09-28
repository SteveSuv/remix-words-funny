import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";

export const setPostVote = p.auth
  .input(
    z.object({
      postId: z.number().int(),
      isVoted: z.boolean(),
    }),
  )
  .handler(async ({ context: { userId }, input: { postId, isVoted } }) => {
    if (isVoted) {
      await db
        .insert(UsersToPostsVote)
        .values({ userId: userId!, postId })
        .onConflictDoNothing();
      return;
    }

    await db
      .delete(UsersToPostsVote)
      .where(
        and(
          eq(UsersToPostsVote.userId, userId!),
          eq(UsersToPostsVote.postId, postId),
        ),
      );
  });
