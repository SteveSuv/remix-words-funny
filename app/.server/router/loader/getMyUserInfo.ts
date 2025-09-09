import { p } from "~/.server/common/trpc";

export const getMyUserInfo = p.public.query(({ ctx: { myUserInfo } }) => {
  return { myUserInfo };
});
