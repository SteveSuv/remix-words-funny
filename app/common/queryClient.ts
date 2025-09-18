import { addToast } from "@heroui/react";
import { QueryClient } from "@tanstack/react-query";
import { TRPCError } from "@trpc/server";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5min
    },
    mutations: {
      onError(error) {
        addToast({ title: (error as TRPCError).message, color: "danger" });
      },
    },
  },
});
