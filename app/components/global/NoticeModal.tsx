import {
  Button,
  Checkbox,
  cn,
  Modal,
  Spinner,
  toast,
  useOverlayState,
} from "@heroui/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { isNoticeModalOpenAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { LuIcon } from "~/components/common/LuIcon";
import { UserAvatar } from "~/components/common/UserAvatar";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import type { INoticeItem } from "~/common/types";

function NoticeDetails({ item }: { item: INoticeItem }) {
  const { Notice, Actor, TargetPost, RelatedPost, word } = item;
  const isLike = Notice.type === "like";

  return (
    <>
      <span className="relative inline-flex shrink-0">
        <UserAvatar
          isClickable={false}
          name={Actor.name}
          size={34}
          userId={Actor.id}
        />
        <span className="bg-background absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full">
          <LuIcon
            icon={isLike ? Heart : MessageCircle}
            size={12}
            className={isLike ? "text-danger" : "text-accent"}
          />
        </span>
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-medium">
          {Actor.name} {isLike ? "赞了你的评论" : "回复了你的评论"}
        </span>
        <span className="text-muted mt-1 line-clamp-2 block text-sm">
          {isLike
            ? TargetPost.content
            : (RelatedPost?.content ?? TargetPost.content)}
        </span>
        <span className="text-muted mt-1 flex items-center gap-2 text-xs">
          <span>{word}</span>
          <span>·</span>
          <time dateTime={Notice.createdAt.toString()}>
            {dayjs(Notice.createdAt).format("YYYY-MM-DD HH:mm")}
          </time>
        </span>
      </span>
    </>
  );
}

function NoticeItem({
  item,
  isSelected,
  isPending,
  onSelectionChange,
}: {
  item: INoticeItem;
  isSelected: boolean;
  isPending: boolean;
  onSelectionChange: (isSelected: boolean) => void;
}) {
  const { Notice, Actor } = item;
  const isUnread = !Notice.isRead;

  if (isUnread) {
    return (
      <Checkbox
        className="w-full"
        isDisabled={isPending}
        isSelected={isSelected}
        onChange={onSelectionChange}
      >
        <Checkbox.Content
          aria-label={`选择来自 ${Actor.name} 的通知`}
          className={cn(
            "w-full justify-start rounded-lg p-3 text-left transition-colors",
            isSelected ? "bg-accent-soft" : "bg-surface-secondary",
            "hover:bg-default-soft-hover",
          )}
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <NoticeDetails item={item} />
          <span className="mt-2 size-2 shrink-0 rounded-full bg-danger" />
        </Checkbox.Content>
      </Checkbox>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-3">
      <NoticeDetails item={item} />
    </div>
  );
}

export function NoticeModal() {
  const [isOpen, setIsOpen] = useAtom(isNoticeModalOpenAtom);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<Set<number>>(
    new Set(),
  );
  const { isLogin, userId } = useMyUserInfo();
  const queryClient = useQueryClient();
  const state = useOverlayState({ isOpen, onOpenChange: setIsOpen });
  const noticeQueryKey = [
    ...orpc.loader.getNotices.key({ type: "infinite" }),
    userId ?? null,
  ];

  const noticesQuery = useInfiniteQuery(
    orpc.loader.getNotices.infiniteOptions({
      input: (cursor: number | undefined) => ({ cursor: cursor ?? 0 }),
      initialPageParam: 0,
      getNextPageParam: ({ nextCursor }) => nextCursor,
      queryKey: noticeQueryKey,
      enabled: isOpen && isLogin,
      staleTime: 0,
      refetchOnMount: "always",
    }),
  );
  const notices =
    noticesQuery.data?.pages.flatMap((page) => page.notices) ?? [];
  const unreadNotices = notices.filter(({ Notice }) => !Notice.isRead);
  const selectedUnreadNoticeIds = unreadNotices
    .filter(({ Notice }) => selectedNoticeIds.has(Notice.id))
    .map(({ Notice }) => Notice.id);
  const isAllUnreadSelected =
    unreadNotices.length > 0 &&
    selectedUnreadNoticeIds.length === unreadNotices.length;
  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: noticesQuery.isFetching,
    hasNextPage: noticesQuery.hasNextPage,
    onLoadMore: noticesQuery.fetchNextPage,
    disabled: !!noticesQuery.error,
    rootMargin: "0px 0px 80px 0px",
  });

  const refreshNotices = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: noticeQueryKey,
      }),
      queryClient.invalidateQueries({
        queryKey: [
          ...orpc.loader.getNotices.queryKey({ input: { cursor: 0 } }),
          userId ?? null,
        ],
      }),
    ]);
  const markNoticesReadMutation = useMutation(
    orpc.action.markNoticesRead.mutationOptions({
      onSuccess: (_data, { noticeIds }) => {
        setSelectedNoticeIds((current) => {
          const next = new Set(current);
          noticeIds.forEach((noticeId) => next.delete(noticeId));
          return next;
        });
        void refreshNotices();
      },
    }),
  );

  function toggleNoticeSelection(noticeId: number, isSelected: boolean) {
    setSelectedNoticeIds((current) => {
      const next = new Set(current);
      if (isSelected) next.add(noticeId);
      else next.delete(noticeId);
      return next;
    });
  }

  function toggleSelectAllUnread() {
    setSelectedNoticeIds((current) => {
      const next = new Set(current);
      for (const { Notice } of unreadNotices) {
        if (isAllUnreadSelected) next.delete(Notice.id);
        else next.add(Notice.id);
      }
      return next;
    });
  }

  async function markSelectedRead() {
    if (selectedUnreadNoticeIds.length === 0) return;
    await markNoticesReadMutation.mutateAsync({
      noticeIds: selectedUnreadNoticeIds,
    });
    toast.success(`已将 ${selectedUnreadNoticeIds.length} 条通知标为已读`);
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="md" placement="center">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex w-full items-center justify-between gap-3 pr-8">
                <Modal.Heading>通知</Modal.Heading>
                {unreadNotices.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      isDisabled={markNoticesReadMutation.isPending}
                      onPress={toggleSelectAllUnread}
                    >
                      {isAllUnreadSelected ? "取消全选" : "全选"}
                    </Button>
                    {selectedUnreadNoticeIds.length > 0 && (
                      <Button
                        size="sm"
                        variant="primary"
                        isDisabled={markNoticesReadMutation.isPending}
                        onPress={markSelectedRead}
                      >
                        标为已读 ({selectedUnreadNoticeIds.length})
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="max-h-[60vh] overflow-y-auto" ref={rootRef}>
                {noticesQuery.isPending && noticesQuery.isFetching ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : notices.length === 0 ? (
                  <div className="text-muted py-8 text-center">暂无通知</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {notices.map((item) => (
                      <NoticeItem
                        key={item.Notice.id}
                        item={item}
                        isSelected={selectedNoticeIds.has(item.Notice.id)}
                        isPending={markNoticesReadMutation.isPending}
                        onSelectionChange={(isSelected) =>
                          toggleNoticeSelection(item.Notice.id, isSelected)
                        }
                      />
                    ))}
                    <div ref={sentryRef} className="py-2 text-center">
                      {noticesQuery.isFetchingNextPage && <Spinner size="sm" />}
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
