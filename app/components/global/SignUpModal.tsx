import {
  Button,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Modal,
  Spinner,
  TextField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { signUpForm } from "~/common/formSchema";
import { isSignInModalOpenAtom, isSignUpModalOpenAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { useZodForm } from "~/hooks/useZodForm";
import { PasswordInput } from "./PasswordInput";
import { SendVerifyCodeButton } from "./SendVerifyCodeButton";

export function SignUpModal() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useAtom(
    isSignUpModalOpenAtom,
  );

  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  const { form } = useZodForm(signUpForm);

  const signUpMutation = useMutation(orpc.action.signUp.mutationOptions());
  function onOpenChange(isOpen: boolean) {
    setIsSignUpModalOpen(isOpen);
    if (!isOpen) form.reset();
  }
  const state = useOverlayState({ isOpen: isSignUpModalOpen, onOpenChange });
  const isPending = form.formState.isSubmitting || signUpMutation.isPending;
  function close() {
    state.close();
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="sm" placement="center">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Form
              validationBehavior="aria"
              onSubmit={form.handleSubmit(async (data) => {
                await signUpMutation.mutateAsync(data);
                toast.success("注册成功");
                close();
                setIsSignInModalOpen(true);
              })}
            >
              <Modal.Header>
                <Modal.Heading>注册新账号</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <Fieldset.Group className="flex flex-col gap-4">
                  <TextField
                    variant="secondary"
                    fullWidth
                    isInvalid={!!form.formState.errors.name}
                  >
                    <Label>昵称</Label>
                    <Input
                      {...form.register("name")}
                      autoFocus
                      minLength={3}
                      maxLength={16}
                      placeholder="请输入昵称"
                    />
                    {form.formState.errors.name?.message && (
                      <FieldError>
                        {form.formState.errors.name.message}
                      </FieldError>
                    )}
                  </TextField>
                  <TextField
                    fullWidth
                    variant="secondary"
                    isInvalid={!!form.formState.errors.email}
                  >
                    <Label>邮箱</Label>
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="请输入邮箱"
                    />
                    {form.formState.errors.email?.message && (
                      <FieldError>
                        {form.formState.errors.email.message}
                      </FieldError>
                    )}
                  </TextField>
                  <PasswordInput
                    {...form.register("password")}
                    errorMessage={form.formState.errors.password?.message}
                  />
                  <PasswordInput
                    {...form.register("password2")}
                    errorMessage={form.formState.errors.password2?.message}
                    label="确认密码"
                    placeholder="请再次输入密码"
                  />
                  <TextField
                    fullWidth
                    variant="secondary"
                    isInvalid={!!form.formState.errors.verifyCode}
                  >
                    <Label>验证码</Label>
                    <Input
                      {...form.register("verifyCode")}
                      minLength={6}
                      maxLength={6}
                      placeholder="请输入邮箱验证码"
                    />
                    {form.formState.errors.verifyCode?.message && (
                      <FieldError>
                        {form.formState.errors.verifyCode.message}
                      </FieldError>
                    )}
                  </TextField>
                </Fieldset.Group>
              </Modal.Body>
              <Modal.Footer className="flex flex-col">
                <Button fullWidth type="submit" isDisabled={isPending}>
                  {isPending ? <Spinner size="sm" /> : "提交"}
                </Button>
                <div className="flex gap-2 w-full">
                  <SendVerifyCodeButton form={form} />
                  <Button
                    variant="outline"
                    fullWidth
                    onPress={() => {
                      close();
                      setIsSignInModalOpen(true);
                    }}
                  >
                    登录账号
                  </Button>
                </div>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
