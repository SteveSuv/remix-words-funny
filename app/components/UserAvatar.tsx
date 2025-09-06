import BoringAvatar from "boring-avatars";
import { useIsClient } from "usehooks-ts";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export const UserAvatar = ({
  name,
  size = 50,
}: {
  name?: string;
  size?: number;
}) => {
  const { myUserInfo } = useMyUserInfo();

  const isClient = useIsClient();

  if ((myUserInfo || name) && isClient) {
    return (
      <BoringAvatar
        square
        className="rounded-lg"
        size={size}
        name={name || myUserInfo?.name!}
        variant="beam"
        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
      />
    );
  }

  return <div className="bg-foreground-300 h-[50px] w-[50px]" />;
};
