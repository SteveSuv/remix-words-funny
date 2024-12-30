import { p } from "~/.server/trpc";

export const getMyUserInfo = p.public.query(({ ctx: { myUserInfo } }) => {
  return { myUserInfo };
});
