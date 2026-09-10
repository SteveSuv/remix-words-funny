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
import { updatePasswordForm } from "~/common/formSchema";
import {
  isSignInModalOpenAtom,
  isUpdatePasswordModalOpenAtom,
} from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { useZodForm } from "~/hooks/useZodForm";
import { PasswordInput } from "./PasswordInput";
import { SendVerifyCodeButton } from "./SendVerifyCodeButton";

export function UpdatePasswordModal() {
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useAtom(
    isUpdatePasswordModalOpenAtom,
  );
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  const { form } = useZodForm(updatePasswordForm);

  const updatePasswordMutation = useMutation(
    orpc.action.updatePassword.mutationOptions(),
  );
  function onOpenChange(isOpen: boolean) {
    setIsUpdatePasswordModalOpen(isOpen);
    if (!isOpen) form.reset();
  }
  const state = useOverlayState({
    isOpen: isUpdatePasswordModalOpen,
    onOpenChange,
  });
  const isPending =
    form.formState.isSubmitting || updatePasswordMutation.isPending;
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
                await updatePasswordMutation.mutateAsync(data);
                toast.success("密码重设成功");
                close();
                setIsSignInModalOpen(true);
              })}
            >
              <Modal.Header>
                <Modal.Heading>重设密码</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <Fieldset.Group className="flex flex-col gap-4">
                  <TextField
                    fullWidth
                    variant="secondary"
                    isInvalid={!!form.formState.errors.email}
                  >
                    <Label>邮箱</Label>
                    <Input
                      {...form.register("email")}
                      autoFocus
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
                    variant="secondary"
                    fullWidth
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
                <div className="flex w-full gap-2">
                  <SendVerifyCodeButton form={form} />
                  <Button
                    variant="tertiary"
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
