import dayjs from "dayjs";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { UsersToWords } from "~/.server/db/schema";

const prepare = db
  .select({
    wordSlug: UsersToWords.wordSlug,
    updatedAt: UsersToWords.updatedAt,
  })
  .from(UsersToWords)
  .where(
    and(
      eq(UsersToWords.userId, sql.placeholder("userId")),
      gte(UsersToWords.updatedAt, dayjs().subtract(6, "month").toDate()),
      lte(UsersToWords.updatedAt, dayjs().add(1, "day").toDate()),
    ),
  )
  .prepare("prepare");

export const getStudyCalendar = p.auth.query(async ({ ctx: { userId } }) => {
  if (!userId) return { isWordDone: false };
  const studyCalendar = await prepare.execute({ userId });
  return { studyCalendar };
});
