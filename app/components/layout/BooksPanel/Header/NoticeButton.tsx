import { Badge } from "@heroui/react";
import { useSetAtom } from "jotai";
import { Bell } from "lucide-react";
import { isNoticeModalOpenAtom, isSignInModalOpenAtom } from "~/common/store";
import { LuIcon } from "~/components/common/LuIcon";
import { HeaderIconButton } from "./HeaderIconButton";

export function NoticeButton({
  isLoading,
  isLoggedIn,
  unreadCount,
}: {
  isLoading: boolean;
  isLoggedIn: boolean;
  unreadCount: number;
}) {
  const setIsNoticeModalOpen = useSetAtom(isNoticeModalOpenAtom);
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  return (
       <Badge.Anchor>
    <HeaderIconButton
      ariaLabel={unreadCount ? `通知，${unreadCount} 条未读` : "通知"}
      isLoading={isLoading}
      onPress={() => {
        if (!isLoggedIn) {
          setIsSignInModalOpen(true);
          return;
        }
        setIsNoticeModalOpen(true);
      }}
    >
   
        <LuIcon icon={Bell} />
        {unreadCount > 0 && (
          <Badge color="danger" size="sm" variant="primary" >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
     
    </HeaderIconButton> </Badge.Anchor>
  );
}
