import { Button, Modal, Spinner, toast, useOverlayState } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { isSettingModalOpenAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "~/components/common/LuIcon";

export function SignOutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const setIsSettingModalOpen = useSetAtom(isSettingModalOpenAtom);

  const { isLogin } = useMyUserInfo();

  const signOutMutation = useMutation(orpc.action.signOut.mutationOptions());
  const isPending = signOutMutation.isPending;
  const state = useOverlayState({
    isOpen,
    onOpenChange: setIsOpen,
  });

  if (!isLogin) return null;

  return (
    <>
      <Button fullWidth variant="danger-soft" onPress={() => setIsOpen(true)}>
        <LuIcon icon={LogOut} />
        登出账号
      </Button>
      <Modal state={state}>
        <Modal.Backdrop>
          <Modal.Container placement="top" size="xs">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>请注意</Modal.Heading>
              </Modal.Header>
              <Modal.Body>确认登出账号吗？</Modal.Body>
              <Modal.Footer>
                <Button
                  fullWidth
                  isDisabled={isPending}
                  variant="danger-soft"
                  onPress={async () => {
                    await signOutMutation.mutateAsync();
                    state.close();
                    setIsSettingModalOpen(false);
                    await Promise.all([
                      queryClient.invalidateQueries({
                        queryKey: orpc.loader.getMyUserInfo.queryKey(),
                      }),
                      queryClient.invalidateQueries({
                        queryKey: orpc.loader.getStarBooks.queryKey(),
                      }),
                    ]);
                    toast.success("已登出");
                  }}
                >
                  {isPending ? <Spinner size="sm" /> : "确认登出"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
