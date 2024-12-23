import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useDoneWordMutation = ({ wordSlug }: { wordSlug: string }) =>
  useMutation({
    mutationKey: ["doneWord", wordSlug],
    mutationFn: () => {
      return trpcClient.action.doneWord.mutate({ wordSlug });
    },
    onError: OnTRPCError,
  });
