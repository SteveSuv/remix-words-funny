import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToWords } from "~/.server/db/schema";

export const doneWord = p.auth
  .input(z.object({ wordSlug: z.string() }))
  .mutation(async ({ ctx: { userId }, input: { wordSlug } }) => {
    await db.insert(UsersToWords).values({ userId: userId!, wordSlug });
  });
