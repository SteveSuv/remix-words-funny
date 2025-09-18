import { Button } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ThumbsUp } from "lucide-react";
import { trpcClient } from "~/common/trpc";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "./LuIcon";

export const CommentVoteButton = ({ postId }: { postId: number }) => {
  const { isLogin } = useMyUserInfo();

  const getPostVoteQuery = useQuery(
    trpcClient.loader.getPostVote.queryOptions(
      { postId },
      { enabled: !!postId },
    ),
  );
  const { postVotesCount = 0 } = getPostVoteQuery.data || {};

  const getIsPostVoteQuery = useQuery(
    trpcClient.loader.getIsPostVote.queryOptions(
      { postId },
      { enabled: !!postId },
    ),
  );
  const { isPostVote = false } = getIsPostVoteQuery.data || {};

  const votePostMutation = useMutation(
    trpcClient.action.votePost.mutationOptions(),
  );
  const unVotePostMutation = useMutation(
    trpcClient.action.unVotePost.mutationOptions(),
  );

  return (
    <Button
      size="sm"
      variant="flat"
      color={isPostVote ? "primary" : "default"}
      isLoading={
        getPostVoteQuery.isFetching ||
        getIsPostVoteQuery.isFetching ||
        unVotePostMutation.isPending ||
        votePostMutation.isPending
      }
      isDisabled={!isLogin}
      title={!isLogin ? "请先登录" : ""}
      onPress={async () => {
        if (isPostVote) {
          await unVotePostMutation.mutateAsync({ postId });
        } else {
          await votePostMutation.mutateAsync({ postId });
        }

        await Promise.all([
          getPostVoteQuery.refetch(),
          getIsPostVoteQuery.refetch(),
        ]);
      }}
    >
      <LuIcon icon={ThumbsUp} />
      {postVotesCount > 0 && <div>{postVotesCount}</div>}
    </Button>
  );
};
