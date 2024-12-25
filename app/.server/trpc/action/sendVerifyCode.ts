import { p } from "~/.server/trpc";
import { z } from "zod";
import { email } from "~/common/formSchema";
import { Chance } from "chance";
import { db } from "~/.server/db";
import { Verify } from "~/.server/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendVerifyCodeToEmail } from "~/.server/mail";
import { IS_PROD } from "~/common/constants";

const prepare = db
  .select()
  .from(Verify)
  .where(eq(Verify.email, sql.placeholder("email")))
  .limit(1)
  .prepare("prepare");

export const sendVerifyCode = p.unAuth
  .input(
    z.object({
      email,
    }),
  )
  .mutation(async ({ input: { email } }) => {
    const verifyCode = Chance()
      .integer({ min: 100000, max: 999999 })
      .toString();

    const [verify] = await prepare.execute({ email });

    if (verify) {
      await db
        .update(Verify)
        .set({ code: verifyCode })
        .where(eq(Verify.email, email))
        .returning({ updateAt: Verify.updatedAt });
    } else {
      await db
        .insert(Verify)
        .values({ email, code: verifyCode })
        .returning({ updateAt: Verify.updatedAt });
    }

    if (!IS_PROD) {
      console.log(`verify code is ${verifyCode}`);
    }

    await sendVerifyCodeToEmail({ email, verifyCode });
  });
