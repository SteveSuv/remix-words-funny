import { p } from "~/.server/trpc";
import { Cookies } from "~/.server/cookies";
import { JWT_KEY } from "~/common/constants";

export const signOut = p.auth.mutation(({ ctx }) => {
  Cookies.delete(ctx.resHeaders, JWT_KEY);
});
