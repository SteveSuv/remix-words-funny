import { useLoaderData, useOutletContext } from "react-router";
import { IUserInfo } from "~/common/types";
import { loader } from "~/root";

export const useMyUserInfo = () => {
  const ctx = useOutletContext<{ myUserInfo: IUserInfo } | null>();
  const rootLoaderData = useLoaderData<typeof loader>() || {};

  // page use ctx, component use rootLoaderData
  const myUserInfo = ctx ? ctx.myUserInfo : rootLoaderData.myUserInfo;
  const userId = myUserInfo?.id;
  const isLogin = !!myUserInfo;

  return { myUserInfo, userId, isLogin };
};
