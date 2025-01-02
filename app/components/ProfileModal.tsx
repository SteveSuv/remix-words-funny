import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { atom, useAtom } from "jotai";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { UserAvatar } from "./UserAvatar";
import { StudyCalendar } from "./StudyCalendar";

export const isProfileModalOpenAtom = atom(false);

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
        {(onClose) => {
          return (
            <>
              <ModalHeader>{myUserInfo.name}</ModalHeader>
              <ModalBody>
                <div className="mb-4 flex items-center gap-2">
                  <UserAvatar />
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-foreground-600">
                      {myUserInfo.email}
                    </div>
                    <small className="text-foreground-400">
                      注册于 {myUserInfo.createdAt.toLocaleString()}
                    </small>
                  </div>
                </div>
                <StudyCalendar />
              </ModalBody>
              <ModalFooter />
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
