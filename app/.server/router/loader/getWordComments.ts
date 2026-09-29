import { count, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Post, User, UsersToPostsVote } from "~/.server/db/schema";
import { PAGE_SIZE } from "~/common/constants";

const getWordCommentsPrepare = db
  .select()
  .from(Post)
  .where(eq(Post.wordSlug, sql.placeholder("wordSlug")))
  .innerJoin(User, eq(User.id, Post.userId))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .orderBy(desc(Post.id))
  .prepare("getWordComments");

const getCommentVotesPrepare = db
  .select({
    postId: UsersToPostsVote.postId,
    postVotesCount: count(),
    isPostVote: sql<boolean>`bool_or(${UsersToPostsVote.userId} = ${sql.placeholder("userId")})`,
  })
  .from(UsersToPostsVote)
  .where(
    inArray(
      UsersToPostsVote.postId,
      Array.from({ length: PAGE_SIZE }, (_, index) =>
        sql.placeholder(`postId${index}`),
      ),
    ),
  )
  .groupBy(UsersToPostsVote.postId)
  .prepare("getCommentVotes");

export const getWordComments = p.public
  .input(
    z.object({
      wordSlug: z.string(),
      cursor: z.number().int().default(0),
    }),
  )
  .handler(async ({ context: { userId }, input: { wordSlug, cursor } }) => {
    const rows = await getWordCommentsPrepare.execute({
      wordSlug,
      offset: PAGE_SIZE * cursor,
      limit: PAGE_SIZE + 1,
    });

    const comments = rows.slice(0, PAGE_SIZE);
    const nextCursor = rows.length > PAGE_SIZE ? cursor + 1 : undefined;
    const votes = comments.length
      ? await getCommentVotesPrepare.execute({
          userId: userId ?? 0,
          ...Object.fromEntries(
            Array.from({ length: PAGE_SIZE }, (_, index) => [
              `postId${index}`,
              comments[index]?.Post.id ?? comments[0].Post.id,
            ]),
          ),
        })
      : [];
    const votesByPostId = new Map(votes.map((vote) => [vote.postId, vote]));
    const wordComments = comments.map((comment) => ({
      ...comment,
      postVotesCount: votesByPostId.get(comment.Post.id)?.postVotesCount ?? 0,
      isPostVote: votesByPostId.get(comment.Post.id)?.isPostVote ?? false,
    }));

    return { wordComments, nextCursor };
  });
