import { db } from "~/.server/db";
import { p } from "~/.server/trpc";
import { Post } from "~/.server/db/schema";
import { z } from "zod";

export const sendComment = p.auth
  .input(z.object({ content: z.string(), wordSlug: z.string() }))
  .mutation(async ({ ctx: { userId }, input: { content, wordSlug } }) => {
    await db.insert(Post).values({ userId: userId!, wordSlug, content });
  });
