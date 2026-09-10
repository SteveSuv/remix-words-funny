import {
  Button,
  FieldError,
  Fieldset,
  Form,
  Separator,
  Spinner,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { commentForm } from "~/common/formSchema";
import {
  isSignInModalOpenAtom,
  isWordDetailPanelDrawerOpenAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { useZodForm } from "~/hooks/useZodForm";

export function WordCommentForm() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);
  const { isLogin } = useMyUserInfo();
  const { form } = useZodForm(commentForm);
  const queryClient = useQueryClient();

  const sendCommentMutation = useMutation(
    orpc.action.sendComment.mutationOptions(),
  );
  const isPending =
    form.formState.isSubmitting || sendCommentMutation.isPending;

  return (
    <div>
      <Separator />
      <div className="my-4 text-xl font-medium">评论区</div>
      <Form
        validationBehavior="aria"
        onSubmit={form.handleSubmit(async ({ comment: content }) => {
          if (!isLogin) {
            setIsSignInModalOpen(true);
            return;
          }

          await sendCommentMutation.mutateAsync({
            wordSlug: wordDetailSlug,
            content,
          });
          await queryClient.invalidateQueries({
            queryKey: orpc.loader.getWordComments.key({
              type: "infinite",
              input: { wordSlug: wordDetailSlug },
            }),
          });
          setIsWordDetailPanelDrawerOpen(false);
          toast.success("评论成功");
          form.reset();
        })}
      >
        <Fieldset.Group className="flex flex-col gap-4">
          <TextField
            isDisabled={!isLogin}
            variant="secondary"
            fullWidth
            isInvalid={!!form.formState.errors.comment}
          >
            <TextArea
              {...form.register("comment")}
              readOnly={!isLogin}
              onClick={() => {
                if (!isLogin) setIsSignInModalOpen(true);
              }}
              placeholder="留个评论"
            />
            {form.formState.errors.comment?.message && (
              <FieldError>{form.formState.errors.comment.message}</FieldError>
            )}
          </TextField>

          <Button fullWidth type="submit" isDisabled={isPending || !isLogin}>
            {isPending ? <Spinner size="sm" /> : "提交"}
          </Button>
        </Fieldset.Group>
      </Form>
    </div>
  );
}
