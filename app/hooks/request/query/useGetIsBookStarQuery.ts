import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetIsBookStarQuery = ({
  bookSlug,
  enabled = true,
}: {
  bookSlug: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ["getIsBookStar", bookSlug],
    queryFn: () => {
      return trpcClient.loader.getIsBookStar.query({ bookSlug });
    },
    enabled: !!bookSlug && enabled,
  });
