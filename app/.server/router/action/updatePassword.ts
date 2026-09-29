import { ORPCError } from "@orpc/server";
import dayjs from "dayjs";
import { eq, sql } from "drizzle-orm";
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

const updateUserPasswordPrepare = db
  .update(User)
  .set({
    password: sql.placeholder("password"),
  })
  .where(eq(User.email, sql.placeholder("email")))
  .prepare("updatePassword.updateUser");

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

    if (verify.code !== verifyCode) {
      throw new ORPCError("BAD_REQUEST", {
        message: "验证码错误",
      });
    }

    const diff = dayjs().diff(dayjs(verify.updatedAt), "s");

    if (diff > 60) {
      throw new ORPCError("BAD_REQUEST", {
        message: "验证码已过期",
      });
    }

    await updateUserPasswordPrepare.execute({
      email,
      password: encrypt(password),
    });
  });
