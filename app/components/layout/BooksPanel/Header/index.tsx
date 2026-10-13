import { Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Settings, X } from "lucide-react";
import {
  isBooksPanelDrawerOpenAtom,
  isProfileModalOpenAtom,
  profileUserIdAtom,
  isSettingModalOpenAtom,
  isSignInModalOpenAtom,
} from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "~/components/common/LuIcon";
import { UserAvatar } from "~/components/common/UserAvatar";
import { HeaderIconButton } from "./HeaderIconButton";
import { NoticeButton } from "./NoticeButton";

function SettingButton({ isLoading }: { isLoading: boolean }) {
  const setIsSettingModalOpen = useSetAtom(isSettingModalOpenAtom);

  return (
    <HeaderIconButton
      ariaLabel="设置"
      isLoading={isLoading}
      onPress={() => setIsSettingModalOpen(true)}
    >
      <LuIcon icon={Settings} />
    </HeaderIconButton>
  );
}

function SignInButton() {
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  return (
    <Button variant="outline" onPress={() => setIsSignInModalOpen(true)}>
      登录
    </Button>
  );
}

function CloseMenuButton() {
  const setIsBooksPanelDrawerOpen = useSetAtom(isBooksPanelDrawerOpenAtom);

  return (
    <div className="flex xl:hidden">
      <Button
        isIconOnly
        variant="outline"
        onPress={() => setIsBooksPanelDrawerOpen(false)}
      >
        <LuIcon icon={X} />
      </Button>
    </div>
  );
}

export function BooksPanelHeader() {
  const { myUserInfo, query, userId } = useMyUserInfo();

  const noticeQuery = useQuery(
    orpc.loader.getNotices.queryOptions({
      input: { cursor: 0 },
      queryKey: [
        ...orpc.loader.getNotices.queryKey({ input: { cursor: 0 } }),
        userId ?? null,
      ],
      enabled: !!userId,
      staleTime: 0,
      refetchOnMount: "always",
    }),
  );
  const isActionLoading =
    query.isLoading || (!!userId && noticeQuery.isLoading);
  const unreadCount = noticeQuery.data?.unreadCount ?? 0;

  const setIsProfileModalOpen = useSetAtom(isProfileModalOpenAtom);
  const setProfileUserId = useSetAtom(profileUserIdAtom);

  return (
    <header className="border-separator h-18 border-b px-4">
      {query.isLoading && (
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-sm" />
              <Skeleton className="h-3 w-12 rounded-sm" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NoticeButton
              isLoading={isActionLoading}
              isLoggedIn={!!userId}
              unreadCount={unreadCount}
            />
            <SettingButton isLoading={isActionLoading} />
          </div>
        </div>
      )}
      {!query.isLoading && myUserInfo ? (
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setProfileUserId(myUserInfo.id);
                setIsProfileModalOpen(true);
              }}
              className="flex min-w-0 cursor-pointer items-center gap-2 text-left transition-opacity hover:opacity-70"
            >
              <UserAvatar isClickable={false} />
              <span className="flex min-w-0 flex-col justify-center">
                <span className="font-medium">{myUserInfo.name}</span>
                <small className="text-muted">查看我的主页</small>
              </span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <NoticeButton
              isLoading={isActionLoading}
              isLoggedIn={!!userId}
              unreadCount={unreadCount}
            />
            <SettingButton isLoading={isActionLoading} />
            <CloseMenuButton />
          </div>
        </div>
      ) : null}
      {!query.isLoading && !myUserInfo ? (
        <div className="flex h-full items-center justify-between">
          <SignInButton />
          <div className="flex items-center gap-1">
            <NoticeButton
              isLoading={isActionLoading}
              isLoggedIn={!!userId}
              unreadCount={unreadCount}
            />
            <SettingButton isLoading={isActionLoading} />
            <CloseMenuButton />
          </div>
        </div>
      ) : null}
    </header>
  );
}
