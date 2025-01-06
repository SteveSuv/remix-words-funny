import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetIsPostVoteQuery = ({ postId }: { postId: number }) =>
  useQuery({
    queryKey: ["getIsPostVote", postId],
    queryFn: () => {
      return trpcClient.loader.getIsPostVote.query({ postId });
    },
    enabled: !!postId,
  });
