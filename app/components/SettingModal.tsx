import {
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@heroui/react";
import { useAtom } from "jotai";
import { isSettingModalOpenAtom } from "~/common/store";
import { useAppTheme } from "~/hooks/useAppTheme";
import { GithubButton } from "./GithubButton";
import { SignOutButton } from "./SignOutButton";

export const SettingModal = () => {
  const [isSettingModalOpen, setIsSettingModalOpen] = useAtom(
    isSettingModalOpenAtom,
  );

  const { isDarkMode, toggleTheme } = useAppTheme();

  return (
    <Modal
      isOpen={isSettingModalOpen}
      onOpenChange={setIsSettingModalOpen}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>设置</ModalHeader>
            <ModalBody>
              <Listbox aria-label="settings">
                <ListboxItem
                  onPress={() => {
                    toggleTheme();
                    onClose();
                  }}
                  key="darkmode"
                  endContent={
                    <Switch
                      isSelected={isDarkMode}
                      onValueChange={toggleTheme}
                    />
                  }
                >
                  夜间模式
                </ListboxItem>
              </Listbox>
              <SignOutButton />
              <GithubButton />
            </ModalBody>
            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
