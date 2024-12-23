import { p } from "~/.server/trpc";
import { updatePasswordForm } from "~/common/formSchema";

export const updatePassword = p.unAuth
  .input(updatePasswordForm)
  .mutation(async ({ input }) => {});
