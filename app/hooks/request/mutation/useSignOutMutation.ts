import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useSignOutMutation = () =>
  useMutation({
    mutationKey: ["signOut"],
    mutationFn: () => {
      return trpcClient.action.signOut.mutate();
    },
    onError: OnTRPCError,
  });
