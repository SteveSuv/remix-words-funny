import { sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Post } from "~/.server/db/schema";

const sendCommentPrepare = db
  .insert(Post)
  .values({
    userId: sql.placeholder("userId"),
    wordSlug: sql.placeholder("wordSlug"),
    content: sql.placeholder("content"),
  })
  .prepare("sendComment");

export const sendComment = p.auth
  .input(z.object({ content: z.string(), wordSlug: z.string() }))
  .handler(async ({ context: { userId }, input: { content, wordSlug } }) => {
    await sendCommentPrepare.execute({
      userId,
      wordSlug,
      content,
    });
  });
