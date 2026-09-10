import { ORPCError } from "@orpc/server";
import dayjs from "dayjs";
import { eq, sql } from "drizzle-orm";
import { encrypt } from "~/.server/common/crypto";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { User, Verify } from "~/.server/db/schema";
import { updatePasswordForm } from "~/common/formSchema";

const prepare = db
  .select()
  .from(Verify)
  .where(eq(Verify.email, sql.placeholder("email")))
  .limit(1)
  .prepare("updatePassword.getVerifyByEmail");

export const updatePassword = p.unAuth
  .input(updatePasswordForm)
  .handler(async ({ input: { email, password, verifyCode } }) => {
    const [verify] = await prepare.execute({ email });

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

    await db
      .update(User)
      .set({ password: encrypt(password) })
      .where(eq(User.email, email));
  });
