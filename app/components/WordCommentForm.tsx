import { Divider, Textarea, Button } from "@heroui/react";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { useSendCommentMutation } from "~/hooks/request/mutation/useSendCommentMutation";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { useZodForm } from "~/hooks/useZodForm";
import { commentForm } from "~/common/formSchema";
import toast from "react-hot-toast";
import { FormFieldError } from "./FormFieldError";
import { useQueryClient } from "@tanstack/react-query";
import { clsx } from "~/common/clsx";

export const WordCommentForm = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
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
          toast.success("评论成功");
          form.reset();
        })}
      >
        <div
          className={clsx(
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
