import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "请求失败";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      toast.danger(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError(error) {
      toast.danger(getErrorMessage(error));
    },
  }),
});
