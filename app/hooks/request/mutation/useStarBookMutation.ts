import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useStarBookMutation = ({ bookSlug }: { bookSlug: string }) =>
  useMutation({
    mutationKey: ["starBook", bookSlug],
    mutationFn: () => {
      return trpcClient.action.starBook.mutate({ bookSlug });
    },
    onError: OnTRPCError,
  });
