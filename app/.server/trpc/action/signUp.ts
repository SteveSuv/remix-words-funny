import { TRPCError } from "@trpc/server";
import { db } from "~/.server/db";
import { User, Verify } from "~/.server/db/schema";
import { p } from "~/.server/trpc";
import { signUpForm } from "~/common/formSchema";
import dayjs from "dayjs";
import { encrypt } from "~/.server/crypto";
import { eq, sql } from "drizzle-orm";

const prepareGetUserByEmail = db
  .select()
  .from(User)
  .where(eq(User.email, sql.placeholder("email")))
  .limit(1)
  .prepare("prepareGetUserByEmail");

const prepareGetUserByName = db
  .select()
  .from(User)
  .where(eq(User.name, sql.placeholder("name")))
  .limit(1)
  .prepare("prepareGetUserByName");

const prepareGetVerifyByEmail = db
  .select()
  .from(Verify)
  .where(eq(Verify.email, sql.placeholder("email")))
  .limit(1)
  .prepare("prepareGetUserByName");

export const signUp = p.unAuth
  .input(signUpForm)
  .mutation(async ({ input: { email, name, password, verifyCode } }) => {
    const [userByEmail] = await prepareGetUserByEmail.execute({ email });

    if (userByEmail) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "邮箱已被使用",
      });
    }

    const [userByName] = await prepareGetUserByName.execute({ name });

    if (userByName) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "昵称已被使用",
      });
    }

    const [verify] = await prepareGetVerifyByEmail.execute({ email });

    if (!verify) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "请先发送验证码",
      });
    }

    if (verify.code !== verifyCode) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "验证码错误",
      });
    }

    const diff = dayjs().diff(dayjs(verify.updatedAt), "s");

    if (diff > 60) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "验证码已过期",
      });
    }

    await db.insert(User).values({ name, email, password: encrypt(password) });
  });
