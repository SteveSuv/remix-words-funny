import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetPostVoteQuery = ({ postId }: { postId: number }) =>
  useQuery({
    queryKey: ["getPostVote", postId],
    queryFn: () => {
      return trpcClient.loader.getPostVote.query({ postId });
    },
    enabled: !!postId,
  });
