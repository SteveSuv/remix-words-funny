import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { signUpForm } from "~/common/formSchema";
import { trpcClient } from "~/common/trpc";
import { OnTRPCError } from "~/common/utils";

export const useSignUpMutation = () =>
  useMutation({
    mutationKey: ["signUp"],
    mutationFn: (data: z.infer<typeof signUpForm>) => {
      return trpcClient.action.signUp.mutate(data);
    },
    onError: OnTRPCError,
  });
