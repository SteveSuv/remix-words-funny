import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { signInForm } from "~/common/formSchema";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useSignInMutation = () =>
  useMutation({
    mutationKey: ["signIn"],
    mutationFn: (data: z.infer<typeof signInForm>) => {
      return trpcClient.action.signIn.mutate(data);
    },
    onError: OnTRPCError,
  });
