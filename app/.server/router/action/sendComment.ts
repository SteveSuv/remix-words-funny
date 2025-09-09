import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { Post } from "~/.server/db/schema";

export const sendComment = p.auth
  .input(z.object({ content: z.string(), wordSlug: z.string() }))
  .mutation(async ({ ctx: { userId }, input: { content, wordSlug } }) => {
    await db.insert(Post).values({ userId: userId!, wordSlug, content });
  });
