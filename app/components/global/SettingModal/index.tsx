import { Button, Modal, Switch, useOverlayState } from "@heroui/react";
import { useAtom } from "jotai";
import { GitFork } from "lucide-react";
import { isSettingModalOpenAtom } from "~/common/store";
import { LuIcon } from "~/components/common/LuIcon";
import { useAppTheme } from "~/hooks/useAppTheme";
import { SignOutButton } from "./SignOutButton";

function GithubButton() {
  return (
    <Button
      variant="outline"
      fullWidth
      onPress={() => {
        window.open("https://github.com/SteveSuv/remix-words-funny", "_blank");
      }}
    >
      <LuIcon icon={GitFork} />
      前往源码
    </Button>
  );
}

export function SettingModal() {
  const [isSettingModalOpen, setIsSettingModalOpen] = useAtom(
    isSettingModalOpenAtom,
  );

  const { isDarkMode, toggleTheme } = useAppTheme();
  const state = useOverlayState({
    isOpen: isSettingModalOpen,
    onOpenChange: setIsSettingModalOpen,
  });

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="sm" placement="center">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>设置</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-3">
                <Switch
                  isSelected={isDarkMode}
                  onChange={() => {
                    toggleTheme();
                    state.close();
                  }}
                >
                  <Switch.Content className="flex justify-between w-full">
                    夜间模式
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex flex-col">
              <SignOutButton />
              <GithubButton />
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
