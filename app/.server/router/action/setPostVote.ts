import { and, count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Notice, Post, UsersToPostsVote } from "~/.server/db/schema";

function prepareSetPostVoteTransactionQueries(
  tx: Pick<typeof db, "select" | "insert" | "delete">,
) {
  const insertVotePrepare = tx
    .insert(UsersToPostsVote)
    .values({
      userId: sql.placeholder("userId"),
      postId: sql.placeholder("postId"),
    })
    .onConflictDoNothing()
    .returning({ postId: UsersToPostsVote.postId })
    .prepare("setPostVote.insert");

  const deleteVotePrepare = tx
    .delete(UsersToPostsVote)
    .where(
      and(
        eq(UsersToPostsVote.userId, sql.placeholder("userId")),
        eq(UsersToPostsVote.postId, sql.placeholder("postId")),
      ),
    )
    .prepare("setPostVote.delete");

  const deleteLikeNoticesPrepare = tx
    .delete(Notice)
    .where(
      and(
        eq(Notice.actorUserId, sql.placeholder("userId")),
        eq(Notice.type, "like"),
        eq(Notice.targetPostId, sql.placeholder("postId")),
      ),
    )
    .prepare("setPostVote.deleteLikeNotices");

  const getPostOwnerPrepare = tx
    .select({ userId: Post.userId })
    .from(Post)
    .where(eq(Post.id, sql.placeholder("postId")))
    .limit(1)
    .prepare("setPostVote.getPostOwner");

  const insertNoticePrepare = tx
    .insert(Notice)
    .values({
      recipientUserId: sql.placeholder("recipientUserId"),
      actorUserId: sql.placeholder("actorUserId"),
      type: "like",
      targetPostId: sql.placeholder("postId"),
    })
    .prepare("setPostVote.insertNotice");

  const getVoteStatePrepare = tx
    .select({
      postVotesCount: count(),
      isPostVote: sql<boolean>`coalesce(bool_or(${UsersToPostsVote.userId} = ${sql.placeholder("userId")}), false)`,
    })
    .from(UsersToPostsVote)
    .where(eq(UsersToPostsVote.postId, sql.placeholder("postId")))
    .prepare("setPostVote.getState");

  return {
    insertVotePrepare,
    deleteVotePrepare,
    deleteLikeNoticesPrepare,
    getPostOwnerPrepare,
    insertNoticePrepare,
    getVoteStatePrepare,
  };
}

export const setPostVote = p.auth
  .input(
    z.object({
      postId: z.number().int(),
      isVoted: z.boolean(),
    }),
  )
  .handler(async ({ context: { userId }, input: { postId, isVoted } }) => {
    return db.transaction(async (tx) => {
      const {
        insertVotePrepare,
        deleteVotePrepare,
        deleteLikeNoticesPrepare,
        getPostOwnerPrepare,
        insertNoticePrepare,
        getVoteStatePrepare,
      } = prepareSetPostVoteTransactionQueries(tx);

      if (isVoted) {
        const insertedVotes = await insertVotePrepare.execute({
          userId,
          postId,
        });

        if (insertedVotes.length > 0) {
          const [post] = await getPostOwnerPrepare.execute({ postId });

          if (post) {
            await insertNoticePrepare.execute({
              recipientUserId: post.userId,
              actorUserId: userId,
              postId,
            });
          }
        }
      } else {
        await deleteVotePrepare.execute({ userId, postId });
        await deleteLikeNoticesPrepare.execute({ userId, postId });
      }

      const [state] = await getVoteStatePrepare.execute({ userId, postId });
      return state;
    });
  });
