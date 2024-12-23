import { p } from "~/.server/trpc";

export const getMyUserInfo = p.public.query(({ ctx }) => {
  return { myUserInfo: ctx.myUserInfo };
});
