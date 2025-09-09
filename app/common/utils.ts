import { addToast } from "@heroui/react";
import { TRPCError } from "@trpc/server";

export const OnTRPCError = (error: Error) => {
  addToast({ title: (error as TRPCError).message, color: "danger" });
};
