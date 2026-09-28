import { ProgressBar, Spinner, Toast } from "@heroui/react";
import { atom, useAtomValue, type Atom } from "jotai";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useNavigation } from "react-router";
import {
  isBooksPanelDrawerOpenAtom,
  isManageBooksModalOpenAtom,
  isProfileModalOpenAtom,
  isSettingModalOpenAtom,
  isSignInModalOpenAtom,
  isSignUpModalOpenAtom,
  isUpdatePasswordModalOpenAtom,
  isWordDetailPanelDrawerOpenAtom,
} from "~/common/store";
import { useAppTheme } from "~/hooks/useAppTheme";

const SignInModal = lazy(() =>
  import("./SignInModal").then((module) => ({ default: module.SignInModal })),
);
const SignUpModal = lazy(() =>
  import("./SignUpModal").then((module) => ({ default: module.SignUpModal })),
);
const UpdatePasswordModal = lazy(() =>
  import("./UpdatePasswordModal").then((module) => ({
    default: module.UpdatePasswordModal,
  })),
);
const SettingModal = lazy(() =>
  import("./SettingModal").then((module) => ({ default: module.SettingModal })),
);
const ProfileModal = lazy(() =>
  import("./ProfileModal").then((module) => ({ default: module.ProfileModal })),
);
const ManageBooksModal = lazy(() =>
  import("./ManageBooksModal").then((module) => ({
    default: module.ManageBooksModal,
  })),
);
const MobileDrawers = lazy(() =>
  import("./MobileDrawers").then((module) => ({
    default: module.MobileDrawers,
  })),
);
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null;

const isMobileDrawerOpenAtom = atom(
  (get) =>
    get(isBooksPanelDrawerOpenAtom) || get(isWordDetailPanelDrawerOpenAtom),
);

function DeferredOverlay({
  openAtom,
  children,
}: {
  openAtom: Atom<boolean>;
  children: ReactNode;
}) {
  const isOpen = useAtomValue(openAtom);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  if (!isOpen && !hasOpened) return null;

  return (
    <Suspense
      fallback={
        isOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <Spinner aria-label="正在加载" />
          </div>
        ) : null
      }
    >
      {children}
    </Suspense>
  );
}

export function GlobalComponents() {
  useAppTheme();
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
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools />
        </Suspense>
      )}
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
      <DeferredOverlay openAtom={isSignInModalOpenAtom}>
        <SignInModal />
      </DeferredOverlay>
      <DeferredOverlay openAtom={isSignUpModalOpenAtom}>
        <SignUpModal />
      </DeferredOverlay>
      <DeferredOverlay openAtom={isUpdatePasswordModalOpenAtom}>
        <UpdatePasswordModal />
      </DeferredOverlay>
      <DeferredOverlay openAtom={isSettingModalOpenAtom}>
        <SettingModal />
      </DeferredOverlay>
      <DeferredOverlay openAtom={isProfileModalOpenAtom}>
        <ProfileModal />
      </DeferredOverlay>
      <DeferredOverlay openAtom={isManageBooksModalOpenAtom}>
        <ManageBooksModal />
      </DeferredOverlay>
      <DeferredOverlay openAtom={isMobileDrawerOpenAtom}>
        <MobileDrawers />
      </DeferredOverlay>
    </>
  );
}
