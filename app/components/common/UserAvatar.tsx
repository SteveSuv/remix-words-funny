import Avatar from "boring-avatars";
import { useSetAtom } from "jotai";
import { isProfileModalOpenAtom, profileUserIdAtom } from "~/common/store";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export function UserAvatar({
  name,
  size = 50,
  userId,
  isClickable = true,
}: {
  name?: string;
  size?: number;
  userId?: number;
  isClickable?: boolean;
}) {
  const { myUserInfo } = useMyUserInfo();
  const setProfileUserId = useSetAtom(profileUserIdAtom);
  const setIsProfileModalOpen = useSetAtom(isProfileModalOpenAtom);

  const displayName = name || myUserInfo?.name || "";
  const profileId = userId ?? myUserInfo?.id;
  const avatar = <Avatar name={displayName} size={size} title variant="beam" />;

  if (!profileId || !isClickable) return avatar;

  return (
    <button
      type="button"
      aria-label={`查看 ${displayName} 的主页`}
      className="inline-flex shrink-0 cursor-pointer rounded-full p-0 align-middle transition-opacity hover:opacity-60"
      onClick={() => {
        setProfileUserId(profileId);
        setIsProfileModalOpen(true);
      }}
    >
      {avatar}
    </button>
  );
}
