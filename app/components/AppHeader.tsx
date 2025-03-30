import { UserAvatar } from "./UserAvatar";
import { SettingButton } from "./SettingButton";
import { SignInButton } from "./SignInButton";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { useSetAtom } from "jotai";
import { isProfileModalOpenAtom } from "./ProfileModal";
import { Button } from "@heroui/react";
import { LuIcon } from "./LuIcon";
import { Moon, Sun } from "lucide-react";
import { useAppTheme } from "~/hooks/useAppTheme";
import { GithubIconButton } from "./GithubIconButton";

export const AppHeader = () => {
  const { myUserInfo } = useMyUserInfo();
  const { isDarkMode, toggleTheme } = useAppTheme();

  const setIsProfileModalOpen = useSetAtom(isProfileModalOpenAtom);

  return (
    <div className="border-foreground-100 h-[75px] w-[350px] border-b px-4">
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
              {/* TODO: change mock data to real db data */}
              <div className="text-foreground-400 text-xs">今日已学习0小时</div>
            </div>
          </div>
          <SettingButton />
        </div>
      ) : (
        <div className="flex h-full items-center justify-between">
          <SignInButton />
          <div className="flex items-center gap-1">
            <GithubIconButton />
            <Button variant="light" isIconOnly onPress={toggleTheme}>
              <LuIcon icon={isDarkMode ? Moon : Sun} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
