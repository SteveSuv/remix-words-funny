import { db } from "~/.server/db";
import { p } from "~/.server/trpc";
import { UsersToBooks } from "~/.server/db/schema";
import { z } from "zod";

export const starBook = p.auth
  .input(z.object({ bookSlug: z.string() }))
  .mutation(async ({ ctx: { userId }, input: { bookSlug } }) => {
    await db.insert(UsersToBooks).values({ userId: userId!, bookSlug });
  });
