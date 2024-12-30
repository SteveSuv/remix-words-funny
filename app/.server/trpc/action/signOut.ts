import { p } from "~/.server/trpc";
import { Cookies } from "~/.server/cookies";
import { JWT_KEY } from "~/common/constants";

export const signOut = p.auth.mutation(({ ctx: { resHeaders } }) => {
  Cookies.delete(resHeaders, JWT_KEY);
});
