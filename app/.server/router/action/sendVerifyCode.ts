import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { sendVerifyCodeToEmail } from "~/.server/common/mail";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Verify } from "~/.server/db/schema";
import { IS_PROD } from "~/common/constants";
import { email } from "~/common/formSchema";

const sendVerifyCodeGetVerifyByEmailPrepare = db
  .select()
  .from(Verify)
  .where(eq(Verify.email, sql.placeholder("email")))
  .limit(1)
  .prepare("sendVerifyCode.getVerifyByEmail");

const updateVerifyCodePrepare = db
  .update(Verify)
  .set({
    code: sql.placeholder("code"),
  })
  .where(eq(Verify.email, sql.placeholder("email")))
  .returning({ updateAt: Verify.updatedAt })
  .prepare("sendVerifyCode.update");

const insertVerifyCodePrepare = db
  .insert(Verify)
  .values({
    email: sql.placeholder("email"),
    code: sql.placeholder("code"),
  })
  .returning({ updateAt: Verify.updatedAt })
  .prepare("sendVerifyCode.insert");

export const sendVerifyCode = p.unAuth
  .input(
    z.object({
      email,
    }),
  )
  .handler(async ({ input: { email } }) => {
    const verifyCode = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0");

    const [verify] = await sendVerifyCodeGetVerifyByEmailPrepare.execute({
      email,
    });

    if (verify) {
      await updateVerifyCodePrepare.execute({
        email,
        code: verifyCode,
      });
    } else {
      await insertVerifyCodePrepare.execute({
        email,
        code: verifyCode,
      });
    }

    if (!IS_PROD) {
      console.log(`verify code is ${verifyCode}`);
    }

    await sendVerifyCodeToEmail({ email, verifyCode });
  });
