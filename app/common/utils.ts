import { TRPCError } from "@trpc/server";
import toast from "react-hot-toast";

export const OnTRPCError = (error: Error) => {
  toast.error((error as TRPCError).message);
};
