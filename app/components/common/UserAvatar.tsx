import { Avatar } from "@heroui/react";
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
  const fallback = displayName.trim().charAt(0).toUpperCase();
  const avatarSize = size <= 32 ? "sm" : size >= 48 ? "lg" : "md";

  return (
    <Avatar
      color="accent"
      size={avatarSize}
      variant="soft"
      className="rounded-xl"
    >
      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar>
  );
}
