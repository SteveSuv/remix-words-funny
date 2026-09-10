import { ORPCError } from "@orpc/server";
import { setCookie } from "@orpc/server/helpers";
import { eq, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { encrypt } from "~/.server/common/crypto";
import { p } from "~/.server/common/orpc";
import { db } from "~/.server/db";
import { User } from "~/.server/db/schema";
import { COOKIE_MAX_AGE, JWT_KEY } from "~/common/constants";
import { signInForm } from "~/common/formSchema";

const prepare = db
  .select()
  .from(User)
  .where(eq(User.email, sql.placeholder("email")))
  .limit(1)
  .prepare("signIn.getUserByEmail");

export const signIn = p.unAuth
  .input(signInForm)
  .handler(async ({ context: { resHeaders }, input: { email, password } }) => {
    const [user] = await prepare.execute({ email });

    // if user not exist, throw error
    if (!user) {
      throw new ORPCError("BAD_REQUEST", {
        message: "用户不存在",
      });
    }

    // if user's password is not correct, throw error
    if (user.password !== encrypt(password)) {
      throw new ORPCError("BAD_REQUEST", {
        message: "密码错误",
      });
    }

    // if user exist, sign jwt token to cookie
    const userId = user.id;

    const maxAge = COOKIE_MAX_AGE;

    const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: maxAge,
    });

    setCookie(resHeaders, JWT_KEY, jwtToken, {
      httpOnly: true,
      maxAge,
      path: "/",
      sameSite: "lax",
    });
  });
