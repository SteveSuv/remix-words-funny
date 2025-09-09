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
