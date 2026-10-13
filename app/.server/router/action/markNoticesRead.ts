import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Notice } from "~/.server/db/schema";

const markNoticesReadPrepare = db
  .update(Notice)
  .set({ isRead: true })
  .where(
    and(
      eq(Notice.recipientUserId, sql.placeholder("userId")),
      eq(Notice.isRead, false),
      sql`${Notice.id} = ANY(${sql.placeholder("noticeIds")}::integer[])`,
    ),
  )
  .prepare("markNoticesRead");

export const markNoticesRead = p.auth
  .input(
    z.object({
      noticeIds: z.array(z.number().int().positive()).min(1).max(5000),
    }),
  )
  .handler(async ({ context: { userId }, input: { noticeIds } }) => {
    await markNoticesReadPrepare.execute({
      userId,
      noticeIds: [...new Set(noticeIds)],
    });
  });
