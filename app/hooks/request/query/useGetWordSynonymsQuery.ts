import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetWordSynonymsQuery = ({ wordSlug }: { wordSlug: string }) =>
  useQuery({
    queryKey: ["getWordSynonyms", wordSlug],
    queryFn: () => {
      return trpcClient.loader.getWordSynonyms.query({
        wordSlug,
      });
    },
    enabled: !!wordSlug,
  });
