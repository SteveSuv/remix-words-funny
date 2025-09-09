import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useAtom } from "jotai";
import { isProfileModalOpenAtom } from "~/common/store";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { StudyCalendar } from "./StudyCalendar";
import { UserAvatar } from "./UserAvatar";

export const ProfileModal = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useAtom(
    isProfileModalOpenAtom,
  );

  const { myUserInfo } = useMyUserInfo();

  if (!myUserInfo) return null;

  return (
    <Modal
      isOpen={isProfileModalOpen}
      onOpenChange={setIsProfileModalOpen}
      backdrop="blur"
      size="lg"
    >
      <ModalContent>
        <ModalHeader>{myUserInfo.name}</ModalHeader>
        <ModalBody>
          <div className="mb-4 flex items-center gap-2">
            <UserAvatar />
            <div className="flex flex-col justify-center gap-1">
              <div className="text-foreground-600">{myUserInfo.email}</div>
              <small className="text-foreground-400">
                注册于 {myUserInfo.createdAt.toLocaleString()}
              </small>
            </div>
          </div>
          <StudyCalendar />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
