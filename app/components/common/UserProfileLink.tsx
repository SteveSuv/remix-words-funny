import type { ReactNode } from "react";
import { cn } from "@heroui/react";
import { useSetAtom } from "jotai";
import { isProfileModalOpenAtom, profileUserIdAtom } from "~/common/store";

export function UserProfileLink({
  userId,
  children,
  className,
}: {
  userId: number;
  children: ReactNode;
  className?: string;
}) {
  const setProfileUserId = useSetAtom(profileUserIdAtom);
  const setIsProfileModalOpen = useSetAtom(isProfileModalOpenAtom);

  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer transition-opacity hover:opacity-60",
        className,
      )}
      onClick={() => {
        setProfileUserId(userId);
        setIsProfileModalOpen(true);
      }}
    >
      {children}
    </button>
  );
}
