import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetWordTranslationsQuery = ({
  wordSlug,
}: {
  wordSlug: string;
}) =>
  useQuery({
    queryKey: ["getWordTranslations", wordSlug],
    queryFn: () => {
      return trpcClient.loader.getWordTranslations.query({
        wordSlug,
      });
    },
    enabled: !!wordSlug,
  });
