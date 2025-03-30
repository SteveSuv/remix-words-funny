import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/.server/db";
import { Book } from "~/.server/db/schema";
import { p } from "~/.server/trpc";

const prepare = db
  .select()
  .from(Book)
  .where(eq(Book.slug, sql.placeholder("bookSlug")))
  .limit(1)
  .prepare("prepare");

export const getBookDetail = p.public
  .input(
    z.object({
      bookSlug: z.string(),
    }),
  )
  .query(async ({ input: { bookSlug } }) => {
    const [bookDetail] = await prepare.execute({ bookSlug });
    return { bookDetail };
  });
