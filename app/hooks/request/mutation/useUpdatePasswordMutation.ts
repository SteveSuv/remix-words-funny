import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { updatePasswordForm } from "~/common/formSchema";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useUpdatePasswordMutation = () =>
  useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: (data: z.infer<typeof updatePasswordForm>) => {
      return trpcClient.action.updatePassword.mutate(data);
    },
    onError: OnTRPCError,
  });
