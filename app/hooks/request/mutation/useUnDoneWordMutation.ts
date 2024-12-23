import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useUnDoneWordMutation = ({ wordSlug }: { wordSlug: string }) =>
  useMutation({
    mutationKey: ["unDoneWord", wordSlug],
    mutationFn: () => {
      return trpcClient.action.unDoneWord.mutate({ wordSlug });
    },
    onError: OnTRPCError,
  });
