import { z } from "zod";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";

export const starBook = p.auth
  .input(z.object({ bookSlug: z.string() }))
  .mutation(async ({ ctx: { userId }, input: { bookSlug } }) => {
    await db.insert(UsersToBooks).values({ userId: userId!, bookSlug });
  });
