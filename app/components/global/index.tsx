import { ProgressBar, Toast } from "@heroui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useNavigation } from "react-router";
import { ProfileModal } from "./ProfileModal";
import { SettingModal } from "./SettingModal";
import { SignInModal } from "./SignInModal";
import { SignUpModal } from "./SignUpModal";
import { UpdatePasswordModal } from "./UpdatePasswordModal";
import { MobileDrawers } from "./MobileDrawers";

export function GlobalComponents() {
  const { state } = useNavigation();
  const progress =
    {
      idle: 0,
      submitting: 50,
      loading: 100,
    }[state] || 0;

  return (
    <>
      <Toast.Provider placement="top" />
      <ReactQueryDevtools />
      <div
        className="fixed inset-0 z-50 h-0.5"
        style={{ opacity: progress > 0 ? 1 : 0 }}
      >
        <ProgressBar color="accent" size="sm" value={progress}>
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
      <SignInModal />
      <SignUpModal />
      <UpdatePasswordModal />
      <SettingModal />
      <ProfileModal />
      <MobileDrawers />
    </>
  );
}
