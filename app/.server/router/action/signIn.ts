import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { Cookies } from "~/.server/common/cookies";
import { encrypt } from "~/.server/common/crypto";
import { p } from "~/.server/common/trpc";
import { db } from "~/.server/db";
import { User } from "~/.server/db/schema";
import { COOKIE_MAX_AGE, JWT_KEY } from "~/common/constants";
import { signInForm } from "~/common/formSchema";

const prepare = db
  .select()
  .from(User)
  .where(eq(User.email, sql.placeholder("email")))
  .limit(1)
  .prepare("prepare");

export const signIn = p.unAuth
  .input(signInForm)
  .mutation(
    async ({ ctx: { resHeaders }, input: { email, password, keepAlive } }) => {
      const [user] = await prepare.execute({ email });

      // if user not exist, throw error
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "用户不存在",
        });
      }

      // if user's password is not correct, throw error
      if (user.password !== encrypt(password)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "密码错误",
        });
      }

      // if user exist, sign jwt token to cookie
      const userId = user.id;

      const maxAge = COOKIE_MAX_AGE / (keepAlive ? 1 : 7);

      const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
      });

      Cookies.set(resHeaders, JWT_KEY, jwtToken, { maxAge });
    },
  );
