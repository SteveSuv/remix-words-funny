import { useQuery } from "@tanstack/react-query";
import { orpc } from "~/common/orpcClient";

export function useMyUserInfo() {
  const query = useQuery(orpc.loader.getMyUserInfo.queryOptions());
  const myUserInfo = query.data?.myUserInfo;
  const userId = myUserInfo?.id;
  const isLogin = !!myUserInfo;

  return { myUserInfo, userId, isLogin, query };
}
