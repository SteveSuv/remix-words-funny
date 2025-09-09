import { Button, Divider, Textarea, addToast, cn } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { commentForm } from "~/common/formSchema";
import {
  isWordDetailPanelDrawerOpenAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import { useSendCommentMutation } from "~/hooks/request/mutation/useSendCommentMutation";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { useZodForm } from "~/hooks/useZodForm";
import { FormFieldError } from "./FormFieldError";

export const WordCommentForm = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );
  const { isLogin } = useMyUserInfo();
  const { form } = useZodForm(commentForm);
  const queryClient = useQueryClient();

  const sendCommentMutation = useSendCommentMutation({
    wordSlug: wordDetailSlug,
  });

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">评论区</div>
      <form
        onSubmit={form.handleSubmit(async ({ comment: content }) => {
          await sendCommentMutation.mutateAsync({ content });
          await queryClient.invalidateQueries({
            queryKey: ["getWordComments", wordDetailSlug],
          });
          setIsWordDetailPanelDrawerOpen(false);
          addToast({ title: "评论成功", color: "success" });
          form.reset();
        })}
      >
        <div
          className={cn(
            "flex flex-col gap-2",
            !isLogin && "cursor-not-allowed",
          )}
          title={!isLogin ? "请先登录" : ""}
        >
          <Textarea
            {...form.register("comment")}
            isDisabled={!isLogin}
            variant="bordered"
            placeholder="留个评论"
          />
          <FormFieldError message={form.formState.errors.comment?.message} />
          <Button
            color="primary"
            type="submit"
            isDisabled={!isLogin}
            isLoading={
              form.formState.isSubmitting || sendCommentMutation.isPending
            }
          >
            提交
          </Button>
        </div>
      </form>
    </div>
  );
};
