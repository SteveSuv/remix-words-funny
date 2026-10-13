import {
  Button,
  Card,
  Separator,
  Spinner,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { MessageCircle, Pencil } from "lucide-react";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { isSignInModalOpenAtom } from "~/common/store";
import type { ICommentItem } from "~/common/types";
import { orpc } from "~/common/orpcClient";
import { LuIcon } from "~/components/common/LuIcon";
import { UserAvatar } from "~/components/common/UserAvatar";
import { UserProfileLink } from "~/components/common/UserProfileLink";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { CommentVoteButton } from "./CommentVoteButton";

function CommentReplies({
  rootPostId,
  replies: initialReplies,
  nextCursor,
}: {
  rootPostId: number;
  replies: ICommentItem[];
  nextCursor?: number;
}) {
  const repliesQuery = useInfiniteQuery(
    orpc.loader.getPostReplies.infiniteOptions({
      input: (cursor: number | undefined) => ({
        rootPostId,
        cursor: cursor ?? 0,
      }),
      initialPageParam: 0,
      getNextPageParam: ({ nextCursor: pageCursor }) => pageCursor,
      initialData: {
        pages: [{ replies: initialReplies, nextCursor }],
        pageParams: [0],
      },
      staleTime: 60_000,
    }),
  );
  const replies = repliesQuery.data.pages.flatMap((page) => page.replies);

  return (
    <div className="flex w-full flex-col gap-3 border-l-2 border-separator pl-3">
      {replies.map((reply) => (
        <CommentItem
          key={reply.Post.id}
          comment={reply}
          isReply
          threadRootId={rootPostId}
        />
      ))}
      {repliesQuery.hasNextPage && (
        <Button
          fullWidth
          size="sm"
          variant="outline"
          isDisabled={repliesQuery.isFetchingNextPage}
          onPress={() => void repliesQuery.fetchNextPage()}
        >
          {repliesQuery.isFetchingNextPage ? (
            <Spinner size="sm" />
          ) : (
            "加载更多回复"
          )}
        </Button>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  isReply = false,
  replies = [],
  threadRootId,
}: {
  comment: ICommentItem;
  isReply?: boolean;
  replies?: ICommentItem[];
  threadRootId: number;
}) {
  const {
    User: { id: authorId, name },
    Post: { content, updatedAt, id: postId, wordSlug },
    postVotesCount,
    isPostVote,
  } = comment;
  const { isLogin, userId } = useMyUserInfo();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);
  const queryClient = useQueryClient();
  const sendReplyMutation = useMutation(
    orpc.action.sendComment.mutationOptions(),
  );
  const updateCommentMutation = useMutation(
    orpc.action.updateComment.mutationOptions(),
  );
  const isMine = userId === authorId;

  async function refreshComments() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: orpc.loader.getWordComments.key({
          type: "infinite",
          input: { wordSlug },
        }),
      }),
      queryClient.invalidateQueries({
        queryKey: orpc.loader.getPostReplies.key({
          type: "infinite",
          input: { rootPostId: threadRootId },
        }),
      }),
    ]);
  }

  async function sendReply() {
    const trimmedContent = draftContent.trim();
    if (trimmedContent.length < 3 || sendReplyMutation.isPending) return;

    await sendReplyMutation.mutateAsync({
      wordSlug,
      content: trimmedContent,
      parentPostId: postId,
    });
    await refreshComments();
    setDraftContent("");
    setIsReplyOpen(false);
    toast.success("已回复");
  }

  async function saveEdit() {
    const trimmedContent = draftContent.trim();
    if (trimmedContent.length < 3 || updateCommentMutation.isPending) return;

    await updateCommentMutation.mutateAsync({
      postId,
      content: trimmedContent,
    });
    await refreshComments();
    setIsEditOpen(false);
    toast.success("已更新");
  }

  function openReply() {
    if (!isLogin) {
      setIsSignInModalOpen(true);
      return;
    }
    setIsEditOpen(false);
    setDraftContent("");
    setIsReplyOpen((open) => !open);
  }

  function openEdit() {
    if (isEditOpen) {
      setIsEditOpen(false);
      setDraftContent("");
      return;
    }

    setIsReplyOpen(false);
    setDraftContent(content);
    setIsEditOpen(true);
  }

  const composerOpen = isReplyOpen || isEditOpen;
  const isSaving =
    sendReplyMutation.isPending || updateCommentMutation.isPending;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-start gap-2">
        <div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <UserAvatar name={name} size={30} userId={authorId} />
              <div className="flex min-w-0 flex-col">
                <div className="truncate font-medium">{name}</div>
                <small className="text-muted">
                  {dayjs(updatedAt).format("YYYY-MM-DD HH:mm")}
                </small>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <CommentVoteButton
                postId={postId}
                postVotesCount={postVotesCount}
                isPostVote={isPostVote}
              />
              <Button
                isIconOnly
                size="sm"
                variant="outline"
                aria-label={`回复 ${name}`}
                onPress={openReply}
              >
                <LuIcon icon={MessageCircle} />
              </Button>
              {isMine && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="outline"
                  aria-label="编辑评论"
                  onPress={openEdit}
                >
                  <LuIcon icon={Pencil} />
                </Button>
              )}
            </div>
          </div>

          {isEditOpen ? (
            <TextField variant="secondary" fullWidth>
              <TextArea
                autoFocus
                aria-label="编辑评论"
                maxLength={1000}
                value={draftContent}
                onChange={(event) => setDraftContent(event.target.value)}
                placeholder="编辑评论"
              />
            </TextField>
          ) : (
            <Card className="rounded-field" variant="secondary">
              <Card.Content>
                <div className="wrap-break-word">
                  {isReply &&
                    comment.replyToName &&
                    comment.replyToUserId !== null && (
                      <UserProfileLink
                        userId={comment.replyToUserId}
                        className="mr-1 inline font-medium text-accent"
                      >
                        @{comment.replyToName}
                      </UserProfileLink>
                    )}
                  {content}
                </div>
              </Card.Content>
            </Card>
          )}

          {isReplyOpen && (
            <TextField variant="secondary" fullWidth>
              <TextArea
                autoFocus
                aria-label={`回复 ${name}`}
                maxLength={1000}
                value={draftContent}
                onChange={(event) => setDraftContent(event.target.value)}
                placeholder={`回复 ${name}…`}
              />
            </TextField>
          )}

          {composerOpen && (
            <div className="flex gap-2">
              <Button
                fullWidth
                variant="outline"
                isDisabled={isSaving}
                onPress={() => {
                  setIsReplyOpen(false);
                  setIsEditOpen(false);
                }}
              >
                取消
              </Button>
              <Button
                fullWidth
                isDisabled={draftContent.trim().length < 3 || isSaving}
                onPress={isEditOpen ? saveEdit : sendReply}
              >
                {isSaving ? (
                  <Spinner size="sm" />
                ) : isEditOpen ? (
                  "保存修改"
                ) : (
                  "发送回复"
                )}
              </Button>
            </div>
          )}

          {!isReply && replies.length > 0 && (
            <CommentReplies
              rootPostId={postId}
              replies={replies}
              nextCursor={comment.nextRepliesCursor}
            />
          )}

          {!isReply && (
            <div className="my-2">
              <Separator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WordCommentItem({ comment }: { comment: ICommentItem }) {
  return (
    <CommentItem
      comment={comment}
      replies={comment.replies}
      threadRootId={comment.Post.id}
    />
  );
}
