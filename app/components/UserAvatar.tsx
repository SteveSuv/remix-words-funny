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
        size={size}
        name={name || myUserInfo?.name}
        variant="beam"
      />
    );
  }

  return <div className="h-[50px] w-[50px] bg-foreground-300" />;
};
