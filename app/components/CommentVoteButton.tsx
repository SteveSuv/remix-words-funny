import { Button } from "@heroui/react";
import { ThumbsUp } from "lucide-react";
import { useUnVotePostMutation } from "~/hooks/request/mutation/useUnVotePostMutation";
import { useVotePostMutation } from "~/hooks/request/mutation/useVotePostMutation";
import { useGetIsPostVoteQuery } from "~/hooks/request/query/useGetIsPostVoteQuery";
import { useGetPostVoteQuery } from "~/hooks/request/query/useGetPostVoteQuery";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "./LuIcon";

export const CommentVoteButton = ({ postId }: { postId: number }) => {
  const { isLogin } = useMyUserInfo();

  const getPostVoteQuery = useGetPostVoteQuery({ postId });
  const { postVotesCount = 0 } = getPostVoteQuery.data || {};

  const getIsPostVoteQuery = useGetIsPostVoteQuery({ postId });
  const { isPostVote = false } = getIsPostVoteQuery.data || {};

  const votePostMutation = useVotePostMutation({ postId });
  const unVotePostMutation = useUnVotePostMutation({ postId });

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
          await unVotePostMutation.mutateAsync();
        } else {
          await votePostMutation.mutateAsync();
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
