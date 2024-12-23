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
import { ActivityCalendar } from "react-activity-calendar";

const data = [
  {
    date: "2024-06-23",
    count: 2,
    level: 1,
  },
  {
    date: "2024-08-02",
    count: 16,
    level: 4,
  },
  {
    date: "2024-11-29",
    count: 11,
    level: 3,
  },
];

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
                    <div>{myUserInfo.email}</div>
                    <div>{myUserInfo.createdAt.toLocaleString()}</div>
                  </div>
                </div>
                <ActivityCalendar data={data} />
              </ModalBody>
              <ModalFooter />
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
