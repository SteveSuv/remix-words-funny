import { TRPCError } from "@trpc/server";
import { addToast } from "@heroui/react";

export const OnTRPCError = (error: Error) => {
  addToast({ title: (error as TRPCError).message, color: "danger" });
};
