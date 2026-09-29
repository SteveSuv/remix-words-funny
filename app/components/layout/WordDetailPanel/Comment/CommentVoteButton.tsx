import { Button, Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { ThumbsUp } from "lucide-react";
import { orpc } from "~/common/orpcClient";
import { isSignInModalOpenAtom } from "~/common/store";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "~/components/common/LuIcon";
import type { ICommentItem } from "~/common/types";

export function CommentVoteButton({
  postId,
  postVotesCount,
  isPostVote,
}: {
  postId: number;
  postVotesCount: number;
  isPostVote: boolean;
}) {
  const { isLogin } = useMyUserInfo();
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);

  const queryClient = useQueryClient();
  const setPostVoteMutation = useMutation(
    orpc.action.setPostVote.mutationOptions({
      onSuccess: (state) => {
        queryClient.setQueriesData<
          InfiniteData<{ wordComments: ICommentItem[]; nextCursor?: number }>
        >(
          { queryKey: orpc.loader.getWordComments.key({ type: "infinite" }) },
          (data) =>
            data && {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                wordComments: page.wordComments.map((comment) =>
                  comment.Post.id === postId
                    ? {
                        ...comment,
                        postVotesCount: state.postVotesCount,
                        isPostVote: state.isPostVote,
                      }
                    : comment,
                ),
              })),
            },
        );
      },
    }),
  );
  const isPending = setPostVoteMutation.isPending;

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

        await setPostVoteMutation.mutateAsync({
          postId,
          isVoted: !isPostVote,
        });
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
