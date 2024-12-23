import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetWordDetailQuery = ({ wordSlug }: { wordSlug: string }) =>
  useQuery({
    queryKey: ["getWordDetail", wordSlug],
    queryFn: () => {
      return trpcClient.loader.getWordDetail.query({
        wordSlug,
      });
    },
    enabled: !!wordSlug,
  });
