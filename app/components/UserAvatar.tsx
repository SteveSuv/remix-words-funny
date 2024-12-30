import BoringAvatar from "boring-avatars";
import { useIsClient } from "usehooks-ts";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export const UserAvatar = () => {
  const { myUserInfo } = useMyUserInfo();

  const isClient = useIsClient();

  if (myUserInfo && isClient) {
    return (
      <BoringAvatar square size={50} name={myUserInfo.name} variant="beam" />
    );
  }

  return <div className="h-[50px] w-[50px] bg-foreground-300" />;
};
