import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useSendCommentMutation = ({ wordSlug }: { wordSlug: string }) =>
  useMutation({
    mutationKey: ["sendComment", wordSlug],
    mutationFn: ({ content }: { content: string }) => {
      return trpcClient.action.sendComment.mutate({ wordSlug, content });
    },
    onError: OnTRPCError,
  });
