import { eq, sql } from "drizzle-orm";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { User } from "~/.server/db/schema";

const prepare = db
  .select()
  .from(User)
  .where(eq(User.id, sql.placeholder("id")))
  .limit(1)
  .prepare("getMyUserInfo");

export const getMyUserInfo = p.public.handler(
  async ({ context: { userId } }) => {
    if (!userId) return { myUserInfo: undefined };

    const [myUserInfo] = await prepare.execute({ id: userId });
    return { myUserInfo };
  },
);
