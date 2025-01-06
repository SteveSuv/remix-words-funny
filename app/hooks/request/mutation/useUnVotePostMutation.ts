import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useUnVotePostMutation = ({ postId }: { postId: number }) =>
  useMutation({
    mutationKey: ["unVotePost", postId],
    mutationFn: () => {
      return trpcClient.action.unVotePost.mutate({ postId });
    },
    onError: OnTRPCError,
  });
