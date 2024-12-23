import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetIsWordDoneQuery = ({ wordSlug }: { wordSlug: string }) =>
  useQuery({
    queryKey: ["getIsWordDone", wordSlug],
    queryFn: () => {
      return trpcClient.loader.getIsWordDone.query({ wordSlug });
    },
    enabled: !!wordSlug,
  });
