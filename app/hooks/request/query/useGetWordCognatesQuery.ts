import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetWordCognatesQuery = ({ wordSlug }: { wordSlug: string }) =>
  useQuery({
    queryKey: ["getWordCognates", wordSlug],
    queryFn: () => {
      return trpcClient.loader.getWordCognates.query({
        wordSlug,
      });
    },
    enabled: !!wordSlug,
  });
