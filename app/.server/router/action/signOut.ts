import { deleteCookie } from "@orpc/server/helpers";
import { p } from "~/.server/common/orpc";
import { JWT_KEY } from "~/common/constants";

export const signOut = p.auth.handler(({ context: { resHeaders } }) => {
  deleteCookie(resHeaders, JWT_KEY);
});
