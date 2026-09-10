import { Button, Skeleton } from "@heroui/react";
import { useSetAtom } from "jotai";
import { Settings, X } from "lucide-react";
import {
  isBooksPanelDrawerOpenAtom,
  isProfileModalOpenAtom,
  isSettingModalOpenAtom,
  isSignInModalOpenAtom,
} from "~/common/store";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "~/components/common/LuIcon";
import { UserAvatar } from "~/components/common/UserAvatar";

function SettingButton() {
  const setIsSettingModalOpen = useSetAtom(isSettingModalOpenAtom);

  return (
    <Button
      isIconOnly
      variant="outline"
      onPress={() => setIsSettingModalOpen(true)}
    >
      <LuIcon icon={Settings} />
    </Button>
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
  const { myUserInfo, query } = useMyUserInfo();

  const setIsProfileModalOpen = useSetAtom(isProfileModalOpenAtom);

  return (
    <header className="border-separator h-18 border-b px-4">
      {query.isLoading && (
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-sm" />
              <Skeleton className="h-3 w-12 rounded-sm" />
            </div>
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      )}
      {!query.isLoading && myUserInfo ? (
        <div className="flex h-full items-center justify-between">
          <div
            onClick={() => {
              setIsProfileModalOpen(true);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <UserAvatar />
            <div className="flex flex-col justify-center">
              <div className="font-medium">{myUserInfo.name}</div>
              <small className="text-muted">我的学习日历</small>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <SettingButton />
            <CloseMenuButton />
          </div>
        </div>
      ) : null}
      {!query.isLoading && !myUserInfo ? (
        <div className="flex h-full items-center justify-between">
          <SignInButton />
          <div className="flex items-center gap-1">
            <SettingButton />
            <CloseMenuButton />
          </div>
        </div>
      ) : null}
    </header>
  );
}
