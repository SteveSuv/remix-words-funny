import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetWordSentencesQuery = ({ wordSlug }: { wordSlug: string }) =>
  useQuery({
    queryKey: ["getWordSentences", wordSlug],
    queryFn: () => {
      return trpcClient.loader.getWordSentences.query({
        wordSlug,
      });
    },
    enabled: !!wordSlug,
  });
