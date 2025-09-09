import { Cookies } from "~/.server/common/cookies";
import { p } from "~/.server/common/trpc";
import { JWT_KEY } from "~/common/constants";

export const signOut = p.auth.mutation(({ ctx: { resHeaders } }) => {
  Cookies.delete(resHeaders, JWT_KEY);
});
