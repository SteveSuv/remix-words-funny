import { and, eq, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Post } from "~/.server/db/schema";

const updateCommentPrepare = db
  .update(Post)
  .set({ content: sql.placeholder("content") })
  .where(
    and(
      eq(Post.id, sql.placeholder("postId")),
      eq(Post.userId, sql.placeholder("userId")),
    ),
  )
  .returning({ id: Post.id })
  .prepare("updateComment");

export const updateComment = p.auth
  .input(
    z.object({
      postId: z.number().int().positive(),
      content: z.string().trim().min(3).max(1000),
    }),
  )
  .handler(async ({ context: { userId }, input: { postId, content } }) => {
    const [updatedPost] = await updateCommentPrepare.execute({
      postId,
      userId,
      content,
    });

    if (!updatedPost) {
      throw new ORPCError("NOT_FOUND", {
        message: "评论不存在或无权编辑",
      });
    }
  });
