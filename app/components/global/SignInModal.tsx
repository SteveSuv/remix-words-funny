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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { signInForm } from "~/common/formSchema";
import {
  isSignInModalOpenAtom,
  isSignUpModalOpenAtom,
  isUpdatePasswordModalOpenAtom,
} from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { useZodForm } from "~/hooks/useZodForm";
import { PasswordInput } from "./PasswordInput";

export function SignInModal() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useAtom(
    isSignInModalOpenAtom,
  );
  const setIsSignUpModalOpen = useSetAtom(isSignUpModalOpenAtom);

  const setIsUpdatePasswordModalOpen = useSetAtom(
    isUpdatePasswordModalOpenAtom,
  );

  const { form } = useZodForm(signInForm);
  const queryClient = useQueryClient();

  const signInMutation = useMutation(orpc.action.signIn.mutationOptions());
  function onOpenChange(isOpen: boolean) {
    setIsSignInModalOpen(isOpen);
    if (!isOpen) form.reset();
  }
  const state = useOverlayState({ isOpen: isSignInModalOpen, onOpenChange });
  const isPending = form.formState.isSubmitting || signInMutation.isPending;
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
              onSubmit={form.handleSubmit(async (data) => {
                await signInMutation.mutateAsync(data);
                toast.success("登录成功");
                close();
                await Promise.all([
                  queryClient.invalidateQueries({
                    queryKey: orpc.loader.getMyUserInfo.queryKey(),
                  }),
                  queryClient.invalidateQueries({
                    queryKey: orpc.loader.getStarBooks.queryKey(),
                  }),
                ]);
              })}
            >
              <Modal.Header>
                <Modal.Heading>登录账号</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <Fieldset.Group className="flex flex-col gap-4">
                  <TextField
                    fullWidth
                    isInvalid={!!form.formState.errors.email}
                    variant="secondary"
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
                </Fieldset.Group>
              </Modal.Body>
              <Modal.Footer className="flex flex-col">
                <Button fullWidth type="submit" isDisabled={isPending}>
                  {isPending ? <Spinner size="sm" /> : "提交"}
                </Button>
                <div className="flex w-full gap-2">
                  <Button
                    fullWidth
                    variant="outline"
                    onPress={() => {
                      close();
                      setIsSignUpModalOpen(true);
                    }}
                  >
                    注册新账号
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onPress={() => {
                      close();
                      setIsUpdatePasswordModalOpen(true);
                    }}
                  >
                    重设密码
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
