import { ORPCError } from "@orpc/server";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { encrypt } from "~/.server/common/crypto";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { User, Verify } from "~/.server/db/schema";
import { signUpForm } from "~/common/formSchema";

const signUpGetUserByEmailPrepare = db
  .select()
  .from(User)
  .where(eq(User.email, sql.placeholder("email")))
  .limit(1)
  .prepare("signUp.getUserByEmail");

const signUpGetUserByNamePrepare = db
  .select()
  .from(User)
  .where(eq(User.name, sql.placeholder("name")))
  .limit(1)
  .prepare("signUp.getUserByName");

const signUpGetVerifyByEmailPrepare = db
  .select()
  .from(Verify)
  .where(eq(Verify.email, sql.placeholder("email")))
  .limit(1)
  .prepare("signUp.getVerifyByEmail");

function prepareSignUpTransactionQueries(
  tx: Pick<typeof db, "insert" | "update">,
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
    .prepare("signUp.consumeVerify");

  const insertUserPrepare = tx
    .insert(User)
    .values({
      name: sql.placeholder("name"),
      email: sql.placeholder("email"),
      password: sql.placeholder("password"),
    })
    .prepare("signUp.insertUser");

  return { consumeVerifyPrepare, insertUserPrepare };
}

export const signUp = p.unAuth
  .input(signUpForm)
  .handler(async ({ input: { email, name, password, verifyCode } }) => {
    const [[userByEmail], [userByName], [verify]] = await Promise.all([
      signUpGetUserByEmailPrepare.execute({ email }),
      signUpGetUserByNamePrepare.execute({ name }),
      signUpGetVerifyByEmailPrepare.execute({ email }),
    ]);

    if (userByEmail) {
      throw new ORPCError("BAD_REQUEST", {
        message: "邮箱已被使用",
      });
    }

    if (userByName) {
      throw new ORPCError("BAD_REQUEST", {
        message: "昵称已被使用",
      });
    }

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
      const { consumeVerifyPrepare, insertUserPrepare } =
        prepareSignUpTransactionQueries(tx);
      const [consumedVerify] = await consumeVerifyPrepare.execute({
        email,
        code: encrypt(verifyCode),
      });

      if (!consumedVerify) {
        throw new ORPCError("BAD_REQUEST", {
          message: "验证码已过期或已使用",
        });
      }

      await insertUserPrepare.execute({
        name,
        email,
        password: encrypt(password),
      });
    });
  });
