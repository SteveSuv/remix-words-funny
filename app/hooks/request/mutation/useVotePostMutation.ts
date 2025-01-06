import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useVotePostMutation = ({ postId }: { postId: number }) =>
  useMutation({
    mutationKey: ["votePost", postId],
    mutationFn: () => {
      return trpcClient.action.votePost.mutate({ postId });
    },
    onError: OnTRPCError,
  });
