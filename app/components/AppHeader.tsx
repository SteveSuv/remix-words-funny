import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { Moon, Sun } from "lucide-react";
import { isProfileModalOpenAtom } from "~/common/store";
import { useAppTheme } from "~/hooks/useAppTheme";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { CloseMenuButton } from "./CloseMenuButton";
import { GithubIconButton } from "./GithubIconButton";
import { LuIcon } from "./LuIcon";
import { SettingButton } from "./SettingButton";
import { SignInButton } from "./SignInButton";
import { UserAvatar } from "./UserAvatar";

export const AppHeader = () => {
  const { myUserInfo } = useMyUserInfo();
  const { isDarkMode, toggleTheme } = useAppTheme();

  const setIsProfileModalOpen = useSetAtom(isProfileModalOpenAtom);

  return (
    <div className="border-foreground-100 h-18.75 border-b px-4">
      {myUserInfo ? (
        <div className="flex h-full items-center justify-between">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => {
              setIsProfileModalOpen(true);
            }}
          >
            <UserAvatar />
            <div className="flex flex-col justify-center gap-1">
              <div className="font-bold">{myUserInfo.name}</div>
              <div className="text-foreground-400 text-xs">
                ID: {myUserInfo.id}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <SettingButton />
            <CloseMenuButton />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-between">
          <SignInButton />
          <div className="flex items-center gap-1">
            <GithubIconButton />
            <Button variant="light" isIconOnly onPress={toggleTheme}>
              <LuIcon icon={isDarkMode ? Moon : Sun} />
            </Button>
            <CloseMenuButton />
          </div>
        </div>
      )}
    </div>
  );
};
