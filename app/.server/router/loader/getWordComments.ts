import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Post, User, UsersToPostsVote } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";
import type { ICommentItem } from "~/common/types";

type ReplyRow = {
  rootPostId: number;
  postId: number;
  content: string;
  userId: number;
  wordSlug: string;
  parentPostId: number;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userAvatar: string | null;
  replyToUserId: number | null;
  replyToName: string | null;
};

const getRootCommentsPrepare = db
  .select({
    Post,
    User: { id: User.id, name: User.name, avatar: User.avatar },
  })
  .from(Post)
  .innerJoin(User, eq(User.id, Post.userId))
  .where(
    and(
      eq(Post.wordSlug, sql.placeholder("wordSlug")),
      isNull(Post.parentPostId),
    ),
  )
  .orderBy(desc(Post.id))
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare("getWordComments.roots");

const getRepliesPrepare = db.execute<ReplyRow>(sql`
  SELECT roots."rootPostId",
         reply."postId",
         reply."content",
         reply."userId",
         reply."wordSlug",
         reply."parentPostId",
         reply."createdAt",
         reply."updatedAt",
         reply."userName",
         reply."userAvatar",
         reply."replyToUserId",
         reply."replyToName"
  FROM unnest(${sql.placeholder("rootPostIds")}::integer[]) AS roots("rootPostId")
  CROSS JOIN LATERAL (
    SELECT post."id" AS "postId",
           post."content",
           post."userId",
           post."wordSlug",
           post."parentPostId",
           post."createdAt",
           post."updatedAt",
           author."name" AS "userName",
           author."avatar" AS "userAvatar",
           post."replyToUserId",
           reply_to_user."name" AS "replyToName"
    FROM "Post" post
    INNER JOIN "User" author ON author."id" = post."userId"
    LEFT JOIN "User" reply_to_user ON reply_to_user."id" = post."replyToUserId"
    WHERE post."parentPostId" = roots."rootPostId"
    ORDER BY post."id" DESC
    LIMIT ${sql.placeholder("limit")}
  ) reply
  ORDER BY roots."rootPostId", reply."postId" DESC
`);

const getCommentVotesPrepare = db
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
  .prepare("getWordComments.votes");

type CommentVoteRow = Awaited<
  ReturnType<typeof getCommentVotesPrepare.execute>
>[number];

function toReplyComment(
  reply: ReplyRow,
  votesByPostId: ReadonlyMap<number, CommentVoteRow>,
): ICommentItem {
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
}

export const getWordComments = p.public
  .input(
    z.object({
      wordSlug: z.string(),
      cursor: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ context: { userId }, input: { wordSlug, cursor } }) => {
    const rootRows = await getRootCommentsPrepare.execute({
      wordSlug,
      limit: PAGE_SIZE + 1,
      offset: PAGE_SIZE * cursor,
    });
    const roots = rootRows.slice(0, PAGE_SIZE);
    const nextCursor = rootRows.length > PAGE_SIZE ? cursor + 1 : undefined;
    const rootIds = roots.map(({ Post: post }) => post.id);
    const replyRows = rootIds.length
      ? await getRepliesPrepare.execute({
          rootPostIds: rootIds,
          limit: PAGE_SIZE + 1,
        })
      : [];
    const repliesByRootId = new Map<number, ReplyRow[]>();

    for (const reply of replyRows) {
      const replies = repliesByRootId.get(reply.rootPostId) ?? [];
      replies.push(reply);
      repliesByRootId.set(reply.rootPostId, replies);
    }

    const visibleReplyRows = [...repliesByRootId.values()].flatMap((replies) =>
      replies.slice(0, PAGE_SIZE),
    );
    const postIds = [
      ...rootIds,
      ...visibleReplyRows.map(({ postId }) => postId),
    ];
    const voteRows = postIds.length
      ? await getCommentVotesPrepare.execute({
          postIds,
          userId: userId ?? 0,
        })
      : [];
    const votesByPostId = new Map(voteRows.map((vote) => [vote.postId, vote]));

    const wordComments: ICommentItem[] = roots.map((row) => {
      const vote = votesByPostId.get(row.Post.id);
      const rootReplies = repliesByRootId.get(row.Post.id) ?? [];
      const visibleReplies = rootReplies.slice(0, PAGE_SIZE);

      return {
        ...row,
        replyToName: null,
        replyToUserId: null,
        postVotesCount: vote?.postVotesCount ?? 0,
        isPostVote: vote?.isPostVote ?? false,
        replies: visibleReplies.map((reply) =>
          toReplyComment(reply, votesByPostId),
        ),
        ...(rootReplies.length > PAGE_SIZE && visibleReplies.length > 0
          ? { nextRepliesCursor: visibleReplies.at(-1)?.postId }
          : {}),
      };
    });

    return { wordComments, nextCursor };
  });
