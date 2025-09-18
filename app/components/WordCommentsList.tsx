import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Sofa } from "lucide-react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { wordDetailSlugAtom } from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { LuIcon } from "./LuIcon";
import { SkeletonBox } from "./SkeletonBox";
import { WordCommentItem } from "./WordCommentItem";

export const WordCommentsList = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordCommentsQuery = useInfiniteQuery(
    trpcClient.loader.getWordComments.infiniteQueryOptions(
      {
        wordSlug: wordDetailSlug,
      },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        enabled: !!wordDetailSlug,
      },
    ),
  );

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: getWordCommentsQuery.isFetching,
    hasNextPage: getWordCommentsQuery.hasNextPage,
    onLoadMore: getWordCommentsQuery.fetchNextPage,
    disabled: !!getWordCommentsQuery.error,
    rootMargin: "0px 0px 100px 0px",
  });

  const allComments =
    getWordCommentsQuery.data?.pages.map((e) => e.wordComments).flat(2) || [];

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
          className="text-small text-foreground-400 my-4 text-center"
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
