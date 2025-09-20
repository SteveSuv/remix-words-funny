import { ToastProvider } from "@heroui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProfileModal } from "./ProfileModal";
import { ProgressBar } from "./ProgressBar";
import { SettingModal } from "./SettingModal";
import { SignInModal } from "./SignInModal";
import { SignUpModal } from "./SignUpModal";
import { UpdatePasswordModal } from "./UpdatePasswordModal";

export const GlobalComponents = () => {
  return (
    <>
      <ToastProvider placement="top-center" toastProps={{ timeout: 2000 }} />
      <ReactQueryDevtools />
      <ProgressBar />
      <SignInModal />
      <SignUpModal />
      <UpdatePasswordModal />
      <SettingModal />
      <ProfileModal />
    </>
  );
};
