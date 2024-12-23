import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetWordsOfKeywordQuery = ({
  keyword,
  bookSlug,
}: {
  keyword: string;
  bookSlug: string;
}) =>
  useQuery({
    queryKey: ["getWordsOfKeyword", keyword, bookSlug],
    queryFn: () => {
      return trpcClient.loader.getWordsOfKeyword.query({
        keyword,
        limit: 100,
        // bookSlug,
      });
    },
    enabled: !!keyword && !!bookSlug,
  });
