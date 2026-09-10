import { Button, Spinner } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { ThumbsUp } from "lucide-react";
import { orpc } from "~/common/orpcClient";
import { isSignInModalOpenAtom } from "~/common/store";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "~/components/common/LuIcon";

export function CommentVoteButton({ postId }: { postId: number }) {
  const { isLogin } = useMyUserInfo();
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  const getPostVoteQuery = useQuery(
    orpc.loader.getPostVote.queryOptions({
      input: { postId },
      enabled: !!postId,
    }),
  );
  const { postVotesCount = 0 } = getPostVoteQuery.data || {};

  const getIsPostVoteQuery = useQuery(
    orpc.loader.getIsPostVote.queryOptions({
      input: { postId },
      enabled: !!postId,
    }),
  );
  const { isPostVote = false } = getIsPostVoteQuery.data || {};

  const votePostMutation = useMutation(orpc.action.votePost.mutationOptions());
  const unVotePostMutation = useMutation(
    orpc.action.unVotePost.mutationOptions(),
  );
  const isPending =
    getPostVoteQuery.isFetching ||
    getIsPostVoteQuery.isFetching ||
    unVotePostMutation.isPending ||
    votePostMutation.isPending;

  return (
    <Button
      size="sm"
      variant={isPostVote ? "primary" : "outline"}
      isDisabled={isPending || !isLogin}
      onPress={async () => {
        if (!isLogin) {
          setIsSignInModalOpen(true);
          return;
        }

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
      {isPending ? (
        <Spinner size="sm" />
      ) : (
        <>
          <LuIcon icon={ThumbsUp} />
          {postVotesCount > 0 && <div>{postVotesCount}</div>}
        </>
      )}
    </Button>
  );
}
