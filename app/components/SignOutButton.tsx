import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useRevalidator } from "react-router";
import toast from "react-hot-toast";
import { useSetAtom } from "jotai";
import { useSignOutMutation } from "~/hooks/request/mutation/useSignOutMutation";
import { LuIcon } from "./LuIcon";
import { LogOut } from "lucide-react";
import { isSettingModalOpenAtom } from "~/common/store";

export const SignOutButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { revalidate } = useRevalidator();
  const setIsSettingModalOpen = useSetAtom(isSettingModalOpenAtom);

  const signOutMutation = useSignOutMutation();

  return (
    <>
      <Button variant="flat" color="danger" onPress={onOpen}>
        <LuIcon icon={LogOut} />
        登出账号
      </Button>
      <Modal
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => {
            return (
              <>
                <ModalHeader>请注意</ModalHeader>
                <ModalBody>确认登出账号吗？</ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    取消
                  </Button>
                  <Button
                    color="primary"
                    isLoading={signOutMutation.isPending}
                    onPress={async () => {
                      await signOutMutation.mutateAsync();
                      onClose();
                      setIsSettingModalOpen(false);
                      revalidate();
                      toast.success("已登出");
                    }}
                  >
                    确认
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};
