import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetWordPhrasesQuery = ({ wordSlug }: { wordSlug: string }) =>
  useQuery({
    queryKey: ["getWordPhrases", wordSlug],
    queryFn: () => {
      return trpcClient.loader.getWordPhrases.query({
        wordSlug,
      });
    },
    enabled: !!wordSlug,
  });
