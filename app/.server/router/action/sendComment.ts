import { ORPCError } from "@orpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Notice, Post } from "~/.server/db/schema";

function prepareSendCommentTransactionQueries(
  tx: Pick<typeof db, "select" | "insert">,
) {
  const getParentPostPrepare = tx
    .select({
      id: Post.id,
      userId: Post.userId,
      parentPostId: Post.parentPostId,
    })
    .from(Post)
    .where(
      and(
        eq(Post.id, sql.placeholder("parentPostId")),
        eq(Post.wordSlug, sql.placeholder("wordSlug")),
      ),
    )
    .limit(1)
    .prepare("sendComment.getParentPost");

  const insertPostPrepare = tx
    .insert(Post)
    .values({
      userId: sql.placeholder("userId"),
      wordSlug: sql.placeholder("wordSlug"),
      content: sql.placeholder("content"),
      parentPostId: sql.placeholder("parentPostId"),
      replyToUserId: sql.placeholder("replyToUserId"),
    })
    .returning({ id: Post.id })
    .prepare("sendComment.insertPost");

  const insertNoticePrepare = tx
    .insert(Notice)
    .values({
      recipientUserId: sql.placeholder("recipientUserId"),
      actorUserId: sql.placeholder("actorUserId"),
      type: "reply",
      targetPostId: sql.placeholder("targetPostId"),
      relatedPostId: sql.placeholder("relatedPostId"),
    })
    .prepare("sendComment.insertNotice");

  return { getParentPostPrepare, insertPostPrepare, insertNoticePrepare };
}

export const sendComment = p.auth
  .input(
    z.object({
      content: z.string().trim().min(3).max(1000),
      wordSlug: z.string(),
      parentPostId: z.number().int().positive().optional(),
    }),
  )
  .handler(
    async ({
      context: { userId },
      input: { content, wordSlug, parentPostId },
    }) => {
      await db.transaction(async (tx) => {
        const { getParentPostPrepare, insertPostPrepare, insertNoticePrepare } =
          prepareSendCommentTransactionQueries(tx);

        let parentPost:
          | { id: number; userId: number; parentPostId: number | null }
          | undefined;

        if (parentPostId !== undefined) {
          [parentPost] = await getParentPostPrepare.execute({
            parentPostId,
            wordSlug,
          });

          if (!parentPost) {
            throw new ORPCError("BAD_REQUEST", {
              message: "只能回复当前单词下的评论",
            });
          }
        }

        const parentPostIdForInsert = parentPost
          ? (parentPost.parentPostId ?? parentPost.id)
          : null;

        const [createdPost] = await insertPostPrepare.execute({
          userId,
          wordSlug,
          content,
          parentPostId: parentPostIdForInsert,
          replyToUserId: parentPost?.userId ?? null,
        });

        if (parentPost) {
          await insertNoticePrepare.execute({
            recipientUserId: parentPost.userId,
            actorUserId: userId,
            targetPostId: parentPost.id,
            relatedPostId: createdPost.id,
          });
        }
      });
    },
  );
