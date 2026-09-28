import Avatar from "boring-avatars";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export function UserAvatar({
  name,
  size = 50,
}: {
  name?: string;
  size?: number;
}) {
  const { myUserInfo } = useMyUserInfo();

  const displayName = name || myUserInfo?.name || "";

  return <Avatar name={displayName} size={size} title variant="beam" />;
}
