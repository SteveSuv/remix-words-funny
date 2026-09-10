import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { UsersToBooks } from "~/.server/db/schema";

export const starBook = p.auth
  .input(z.object({ bookSlug: z.string() }))
  .handler(async ({ context: { userId }, input: { bookSlug } }) => {
    await db.insert(UsersToBooks).values({ userId: userId!, bookSlug });
  });
