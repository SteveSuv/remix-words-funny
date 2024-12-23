import { TRPCError } from "@trpc/server";
import toast from "react-hot-toast";

export const sleep = (delay = 1000) =>
  new Promise((r) =>
    setTimeout(() => {
      r(true);
    }, delay),
  );

export const OnTRPCError = (error: Error) => {
  toast.error((error as TRPCError).message);
};
