import { db } from "~/.server/db";
import { p } from "~/.server/trpc";
import { UsersToWords } from "~/.server/db/schema";
import { z } from "zod";

export const doneWord = p.auth
  .input(z.object({ wordSlug: z.string() }))
  .mutation(async ({ ctx: { userId }, input: { wordSlug } }) => {
    await db.insert(UsersToWords).values({ userId: userId!, wordSlug });
  });
