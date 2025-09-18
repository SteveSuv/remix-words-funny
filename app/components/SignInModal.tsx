import {
  Button,
  Checkbox,
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
import { useRevalidator } from "react-router";
import { signInForm } from "~/common/formSchema";
import {
  isSignInModalOpenAtom,
  isSignUpModalOpenAtom,
  isUpdatePasswordModalOpenAtom,
} from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { useZodForm } from "~/hooks/useZodForm";
import { FormFieldError } from "./FormFieldError";
import { PasswordInput } from "./PasswordInput";

export const SignInModal = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useAtom(
    isSignInModalOpenAtom,
  );
  const setIsSignUpModalOpen = useSetAtom(isSignUpModalOpenAtom);

  const setIsUpdatePasswordModalOpen = useSetAtom(
    isUpdatePasswordModalOpenAtom,
  );

  const { form } = useZodForm(signInForm, {
    defaultValues: { keepAlive: true },
  });
  const { revalidate } = useRevalidator();

  const signInMutation = useMutation(
    trpcClient.action.signIn.mutationOptions(),
  );

  return (
    <Modal
      isOpen={isSignInModalOpen}
      onOpenChange={setIsSignInModalOpen}
      backdrop="blur"
      isDismissable={false}
      onClose={form.reset}
    >
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={form.handleSubmit(async (data) => {
              await signInMutation.mutateAsync(data);
              addToast({ title: "登录成功", color: "success" });
              onClose();
              revalidate();
            })}
          >
            <ModalHeader>登录账号</ModalHeader>
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
              <div className="flex justify-between px-1 py-2">
                <Checkbox
                  {...form.register("keepAlive")}
                  classNames={{
                    label: "text-small",
                  }}
                >
                  七天免登录
                </Checkbox>
                <div className="flex items-center gap-2">
                  <Link
                    color="primary"
                    size="sm"
                    className="cursor-pointer underline-offset-2 hover:underline"
                    onPress={() => {
                      onClose();
                      setIsSignUpModalOpen(true);
                    }}
                  >
                    注册新账号
                  </Link>
                  <Link
                    color="primary"
                    size="sm"
                    className="cursor-pointer underline-offset-2 hover:underline"
                    onPress={() => {
                      onClose();
                      setIsUpdatePasswordModalOpen(true);
                    }}
                  >
                    重设密码
                  </Link>
                </div>
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
                  form.formState.isSubmitting || signInMutation.isPending
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
