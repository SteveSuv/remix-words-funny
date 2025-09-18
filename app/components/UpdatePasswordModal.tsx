import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { updatePasswordForm } from "~/common/formSchema";
import {
  isSignInModalOpenAtom,
  isUpdatePasswordModalOpenAtom,
} from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { useZodForm } from "~/hooks/useZodForm";
import { FormFieldError } from "./FormFieldError";
import { PasswordInput } from "./PasswordInput";
import { SendVerifyCodeButton } from "./SendVerifyCodeButton";

export const UpdatePasswordModal = () => {
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useAtom(
    isUpdatePasswordModalOpenAtom,
  );
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  const { form } = useZodForm(updatePasswordForm);

  const updatePasswordMutation = useMutation(
    trpcClient.action.updatePassword.mutationOptions(),
  );

  return (
    <Modal
      isOpen={isUpdatePasswordModalOpen}
      onOpenChange={setIsUpdatePasswordModalOpen}
      backdrop="blur"
      isDismissable={false}
      onClose={form.reset}
    >
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={form.handleSubmit(async (data) => {
              await updatePasswordMutation.mutateAsync(data);
              addToast({ title: "密码重设成功", color: "success" });
              onClose();
              setIsSignInModalOpen(true);
            })}
          >
            <ModalHeader>重设密码</ModalHeader>
            <ModalBody>
              <Input
                {...form.register("email")}
                autoFocus
                label="邮箱"
                type="email"
                placeholder="请输入邮箱"
                variant="bordered"
              />
              <FormFieldError message={form.formState.errors.email?.message} />
              <PasswordInput {...form.register("password")} />
              <FormFieldError
                message={form.formState.errors.password?.message}
              />
              <PasswordInput
                {...form.register("password2")}
                label="确认密码"
                placeholder="请再次输入密码"
              />
              <FormFieldError
                message={form.formState.errors.password2?.message}
              />
              <Input
                {...form.register("verifyCode")}
                minLength={6}
                maxLength={6}
                label="验证码"
                placeholder="请输入邮箱验证码"
                variant="bordered"
              />
              <FormFieldError
                message={form.formState.errors.verifyCode?.message}
              />
              <div className="flex justify-between px-1 py-2">
                <SendVerifyCodeButton form={form} />
                <Link
                  color="primary"
                  size="sm"
                  className="cursor-pointer underline-offset-2 hover:underline"
                  onPress={() => {
                    onClose();
                    setIsSignInModalOpen(true);
                  }}
                >
                  登录账号
                </Link>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={
                  form.formState.isSubmitting ||
                  updatePasswordMutation.isPending
                }
              >
                提交
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
