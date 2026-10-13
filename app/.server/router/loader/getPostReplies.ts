import { count, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToPostsVote } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";
import type { ICommentItem } from "~/common/types";

type ReplyRow = {
  postId: number;
  content: string;
  userId: number;
  wordSlug: string;
  parentPostId: number;
  replyToUserId: number | null;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userAvatar: string | null;
  replyToName: string | null;
};

const getPostRepliesPrepare = db.execute<ReplyRow>(sql`
  SELECT post."id" AS "postId",
         post."content",
         post."userId",
         post."wordSlug",
         post."parentPostId",
         post."replyToUserId",
         post."createdAt",
         post."updatedAt",
         author."name" AS "userName",
         author."avatar" AS "userAvatar",
         reply_to_user."name" AS "replyToName"
  FROM "Post" post
  INNER JOIN "User" author ON author."id" = post."userId"
  LEFT JOIN "User" reply_to_user ON reply_to_user."id" = post."replyToUserId"
  WHERE post."parentPostId" = ${sql.placeholder("rootPostId")}
    AND post."id" < coalesce(
      nullif(${sql.placeholder("cursor")}, 0),
      2147483647
    )
  ORDER BY post."id" DESC
  LIMIT ${PAGE_SIZE + 1}
`);

const getPostReplyVotesPrepare = db
  .select({
    postId: UsersToPostsVote.postId,
    postVotesCount: count(),
    isPostVote: sql<boolean>`coalesce(bool_or(${UsersToPostsVote.userId} = ${sql.placeholder("userId")}), false)`,
  })
  .from(UsersToPostsVote)
  .where(
    sql`${UsersToPostsVote.postId} = ANY(${sql.placeholder("postIds")}::integer[])`,
  )
  .groupBy(UsersToPostsVote.postId)
  .prepare("getPostReplies.votes");

export const getPostReplies = p.public
  .input(
    z.object({
      rootPostId: z.number().int().positive(),
      cursor: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ context: { userId }, input: { rootPostId, cursor } }) => {
    const replyRows = await getPostRepliesPrepare.execute({
      rootPostId,
      cursor,
    });
    const hasMore = replyRows.length > PAGE_SIZE;
    const visibleRows = replyRows.slice(0, PAGE_SIZE);
    const postIds = visibleRows.map(({ postId }) => postId);
    const voteRows = postIds.length
      ? await getPostReplyVotesPrepare.execute({
          postIds,
          userId: userId ?? 0,
        })
      : [];
    const votesByPostId = new Map(voteRows.map((vote) => [vote.postId, vote]));
    const replies: ICommentItem[] = visibleRows.map((reply) => {
      const vote = votesByPostId.get(reply.postId);
      return {
        Post: {
          id: reply.postId,
          content: reply.content,
          userId: reply.userId,
          wordSlug: reply.wordSlug,
          parentPostId: reply.parentPostId,
          replyToUserId: reply.replyToUserId,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
        },
        User: {
          id: reply.userId,
          name: reply.userName,
          avatar: reply.userAvatar,
        },
        replyToName: reply.replyToName,
        replyToUserId: reply.replyToUserId,
        postVotesCount: vote?.postVotesCount ?? 0,
        isPostVote: vote?.isPostVote ?? false,
        replies: [],
      };
    });

    return {
      replies,
      nextCursor: hasMore ? visibleRows.at(-1)?.postId : undefined,
    };
  });
