import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useUnStarBookMutation = ({ bookSlug }: { bookSlug: string }) =>
  useMutation({
    mutationKey: ["unStarBook", bookSlug],
    mutationFn: () => {
      return trpcClient.action.unStarBook.mutate({ bookSlug });
    },
    onError: OnTRPCError,
  });
