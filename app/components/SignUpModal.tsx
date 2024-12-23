import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  Link,
} from "@nextui-org/react";
import { atom, useAtom, useSetAtom } from "jotai";
import { isSignInModalOpenAtom } from "./SignInModal";
import { useZodForm } from "~/hooks/useZodForm";
import { FormFieldError } from "./FormFieldError";
import { signUpForm } from "~/common/formSchema";
import toast from "react-hot-toast";
import { SendVerifyCodeButton } from "./SendVerifyCodeButton";
import { LuIcon } from "./LuIcon";
import { Dices } from "lucide-react";
import { Chance } from "chance";
import { PasswordInput } from "./PasswordInput";
import { useSignUpMutation } from "~/hooks/request/mutation/useSignUpMutation";

export const isSignUpModalOpenAtom = atom(false);

export const SignUpModal = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useAtom(
    isSignUpModalOpenAtom,
  );

  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  const { form } = useZodForm(signUpForm);

  const signUpMutation = useSignUpMutation();

  return (
    <Modal
      isOpen={isSignUpModalOpen}
      onOpenChange={setIsSignUpModalOpen}
      backdrop="blur"
      isDismissable={false}
      onClose={form.reset}
    >
      <ModalContent>
        {(onClose) => {
          return (
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await signUpMutation.mutateAsync(data);
                toast.success("注册成功");
                onClose();
                setIsSignInModalOpen(true);
              })}
            >
              <ModalHeader>注册新账号</ModalHeader>
              <ModalBody>
                <Input
                  {...form.register("name")}
                  autoFocus
                  minLength={3}
                  maxLength={16}
                  label="昵称"
                  placeholder="请输入昵称"
                  variant="bordered"
                  endContent={
                    <Button
                      variant="light"
                      size="sm"
                      isIconOnly
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.setValue("name", Chance().name(), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <LuIcon icon={Dices} />
                    </Button>
                  }
                />
                <FormFieldError message={form.formState.errors.name?.message} />
                <Input
                  {...form.register("email")}
                  label="邮箱"
                  type="email"
                  placeholder="请输入邮箱"
                  variant="bordered"
                />
                <FormFieldError
                  message={form.formState.errors.email?.message}
                />
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
                    form.formState.isSubmitting || signUpMutation.isPending
                  }
                >
                  提交
                </Button>
              </ModalFooter>
            </form>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
