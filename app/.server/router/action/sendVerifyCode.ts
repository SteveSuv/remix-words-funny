import { randomInt } from "node:crypto";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { encrypt } from "~/.server/common/crypto";
import { sendVerifyCodeToEmail } from "~/.server/common/mail";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { Verify } from "~/.server/db/schema";
import { email } from "~/common/formSchema";

const upsertVerifyCodePrepare = db
  .insert(Verify)
  .values({
    email: sql.placeholder("email"),
    code: sql.placeholder("code"),
    expiresAt: sql`now() + interval '10 minutes'`,
  })
  .onConflictDoUpdate({
    target: Verify.email,
    set: {
      code: sql.placeholder("code"),
      expiresAt: sql`now() + interval '10 minutes'`,
      consumedAt: null,
    },
  })
  .prepare("sendVerifyCode.upsert");

export const sendVerifyCode = p.unAuth
  .input(
    z.object({
      email,
    }),
  )
  .handler(async ({ input: { email } }) => {
    const verifyCode = randomInt(0, 1_000_000).toString().padStart(6, "0");

    await upsertVerifyCodePrepare.execute({
      email,
      code: encrypt(verifyCode),
    });

    await sendVerifyCodeToEmail({ email, verifyCode });
  });
