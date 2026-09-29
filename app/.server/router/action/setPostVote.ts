import { and, count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";

const addPostVotePrepare = db
  .insert(UsersToPostsVote)
  .values({
    userId: sql.placeholder("userId"),
    postId: sql.placeholder("postId"),
  })
  .onConflictDoNothing()
  .prepare("setPostVote.add");

const removePostVotePrepare = db
  .delete(UsersToPostsVote)
  .where(
    and(
      eq(UsersToPostsVote.userId, sql.placeholder("userId")),
      eq(UsersToPostsVote.postId, sql.placeholder("postId")),
    ),
  )
  .prepare("setPostVote.remove");

const getPostVoteStatePrepare = db
  .select({
    postVotesCount: count(),
    isPostVote: sql<boolean>`coalesce(bool_or(${UsersToPostsVote.userId} = ${sql.placeholder("userId")}), false)`,
  })
  .from(UsersToPostsVote)
  .where(eq(UsersToPostsVote.postId, sql.placeholder("postId")))
  .prepare("setPostVote.getState");

export const setPostVote = p.auth
  .input(
    z.object({
      postId: z.number().int(),
      isVoted: z.boolean(),
    }),
  )
  .handler(async ({ context: { userId }, input: { postId, isVoted } }) => {
    if (isVoted) {
      await addPostVotePrepare.execute({
        userId,
        postId,
      });
    } else {
      await removePostVotePrepare.execute({ userId, postId });
    }
    const [state] = await getPostVoteStatePrepare.execute({ userId, postId });
    return state;
  });
