import { Button, Divider, Spinner } from "@nextui-org/react";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { SkeletonBox } from "./SkeletonBox";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UserAvatar } from "./UserAvatar";
import dayjs from "dayjs";
import { trpcClient } from "~/common/trpc";
import { LuIcon } from "./LuIcon";
import { SearchX, Sofa, ThumbsUp } from "lucide-react";
import { WordCommentItem } from "./WordCommentItem";

const pageSize = 20;

export const WordCommentsList = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordCommentsQuery = useInfiniteQuery({
    queryKey: ["getWordComments", wordDetailSlug],
    queryFn: async ({ pageParam }) => {
      return trpcClient.loader.getWordComments.query({
        wordSlug: wordDetailSlug,
        offset: pageSize * pageParam,
        limit: pageSize,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.wordComments.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    select(data) {
      return data.pages.map((e) => e.wordComments);
    },
    enabled: !!wordDetailSlug,
  });

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: getWordCommentsQuery.isFetching,
    hasNextPage: getWordCommentsQuery.hasNextPage,
    onLoadMore: getWordCommentsQuery.fetchNextPage,
    disabled: !!getWordCommentsQuery.error,
    rootMargin: "0px 0px 100px 0px",
  });

  const showCommentsList = getWordCommentsQuery.data || [];
  const allComments = showCommentsList.flat(2);

  const totalCount = allComments.length;

  const renderContent = () => {
    if (getWordCommentsQuery.isFetching) {
      return <SkeletonBox />;
    }

    if (allComments.length === 0) {
      return (
        <div className="mb-4 flex flex-col items-center justify-center gap-2">
          <LuIcon icon={Sofa} size={50} className="text-foreground-300" />
          <small className="text-foreground-400">抢沙发</small>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {allComments.map((comment, index) => {
          return <WordCommentItem key={index} comment={comment} />;
        })}
        <div
          ref={sentryRef}
          className="my-4 text-center text-small text-foreground-400"
        >
          共 {totalCount} 条评论
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 flex flex-col" ref={rootRef}>
      {renderContent()}
    </div>
  );
};
