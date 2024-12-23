import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useSendVerifyCodeMutation = ({ email }: { email: string }) =>
  useMutation({
    mutationKey: ["sendVerifyCode", email],
    mutationFn: () => {
      return trpcClient.action.sendVerifyCode.mutate({
        email,
      });
    },
    onError: OnTRPCError,
  });
