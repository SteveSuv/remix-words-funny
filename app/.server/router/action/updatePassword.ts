import { ORPCError } from "@orpc/server";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { encrypt } from "~/.server/common/crypto";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { User, Verify } from "~/.server/db/schema";
import { updatePasswordForm } from "~/common/formSchema";

const updatePasswordGetVerifyByEmailPrepare = db
  .select()
  .from(Verify)
  .where(eq(Verify.email, sql.placeholder("email")))
  .limit(1)
  .prepare("updatePassword.getVerifyByEmail");

function prepareUpdatePasswordTransactionQueries(
  tx: Pick<typeof db, "update">,
) {
  const consumeVerifyPrepare = tx
    .update(Verify)
    .set({ consumedAt: sql`now()` })
    .where(
      and(
        eq(Verify.email, sql.placeholder("email")),
        eq(Verify.code, sql.placeholder("code")),
        isNull(Verify.consumedAt),
        gt(Verify.expiresAt, sql`now()`),
      ),
    )
    .returning({ id: Verify.id })
    .prepare("updatePassword.consumeVerify");

  const updateUserPasswordPrepare = tx
    .update(User)
    .set({
      password: sql.placeholder("password"),
    })
    .where(eq(User.email, sql.placeholder("email")))
    .prepare("updatePassword.updateUser");

  return { consumeVerifyPrepare, updateUserPasswordPrepare };
}

export const updatePassword = p.unAuth
  .input(updatePasswordForm)
  .handler(async ({ input: { email, password, verifyCode } }) => {
    const [verify] = await updatePasswordGetVerifyByEmailPrepare.execute({
      email,
    });

    if (!verify) {
      throw new ORPCError("BAD_REQUEST", {
        message: "请先发送验证码",
      });
    }

    if (verify.consumedAt) {
      throw new ORPCError("BAD_REQUEST", {
        message: "验证码已使用",
      });
    }

    if (verify.code !== encrypt(verifyCode)) {
      throw new ORPCError("BAD_REQUEST", {
        message: "验证码错误",
      });
    }

    if (verify.expiresAt.getTime() <= Date.now()) {
      throw new ORPCError("BAD_REQUEST", {
        message: "验证码已过期",
      });
    }

    await db.transaction(async (tx) => {
      const { consumeVerifyPrepare, updateUserPasswordPrepare } =
        prepareUpdatePasswordTransactionQueries(tx);
      const [consumedVerify] = await consumeVerifyPrepare.execute({
        email,
        code: encrypt(verifyCode),
      });

      if (!consumedVerify) {
        throw new ORPCError("BAD_REQUEST", {
          message: "验证码已过期或已使用",
        });
      }

      await updateUserPasswordPrepare.execute({
        email,
        password: encrypt(password),
      });
    });
  });
