import { Modal, useOverlayState } from "@heroui/react";
import { useAtom } from "jotai";
import { isProfileModalOpenAtom } from "~/common/store";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { StudyCalendar } from "./StudyCalendar";
import { UserAvatar } from "~/components/common/UserAvatar";

export function ProfileModal() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useAtom(
    isProfileModalOpenAtom,
  );

  const { myUserInfo } = useMyUserInfo();
  const state = useOverlayState({
    isOpen: isProfileModalOpen,
    onOpenChange: setIsProfileModalOpen,
  });

  if (!myUserInfo) return null;

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>学习日历</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4 flex items-center gap-2">
                <UserAvatar />
                <div className="flex flex-col justify-center">
                  <div className="font-medium text-foreground">
                    {myUserInfo.name}
                  </div>
                  <small className="text-muted">
                    注册于 {myUserInfo.createdAt.toLocaleString()}
                  </small>
                </div>
              </div>
              <StudyCalendar />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
