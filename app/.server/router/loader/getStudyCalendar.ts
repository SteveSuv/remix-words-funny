import dayjs from "dayjs";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { z } from "zod";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { User, UsersToWords } from "~/.server/db/schema";

const getProfilePrepare = db
  .select({ id: User.id, name: User.name, createdAt: User.createdAt })
  .from(User)
  .where(eq(User.id, sql.placeholder("userId")))
  .limit(1)
  .prepare("getStudyCalendar.profile");

const getStudyCalendarPrepare = db
  .select({
    wordSlug: UsersToWords.wordSlug,
    updatedAt: UsersToWords.updatedAt,
  })
  .from(UsersToWords)
  .where(
    and(
      eq(UsersToWords.userId, sql.placeholder("userId")),
      gte(UsersToWords.updatedAt, sql.placeholder("startAt")),
      lt(UsersToWords.updatedAt, sql.placeholder("endAt")),
    ),
  )
  .prepare("getStudyCalendar");

export const getStudyCalendar = p.public
  .input(z.object({ userId: z.number().int().positive() }))
  .handler(async ({ input: { userId } }) => {
    const [profileRows, studyCalendar] = await Promise.all([
      getProfilePrepare.execute({ userId }),
      getStudyCalendarPrepare.execute({
        userId,
        // Raw prepared-query placeholders bypass Drizzle's timestamp encoder.
        startAt: dayjs()
          .subtract(6, "month")
          .startOf("day")
          .toDate()
          .toISOString(),
        endAt: dayjs().add(1, "day").startOf("day").toDate().toISOString(),
      }),
    ]);

    return { profile: profileRows[0] ?? null, studyCalendar };
  });
