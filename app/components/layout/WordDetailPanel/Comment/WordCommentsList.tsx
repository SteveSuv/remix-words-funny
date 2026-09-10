import { Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Sofa } from "lucide-react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { wordDetailSlugAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { LuIcon } from "~/components/common/LuIcon";
import { WordCommentItem } from "./WordCommentItem";

export function WordCommentsList() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordCommentsQuery = useInfiniteQuery(
    orpc.loader.getWordComments.infiniteOptions({
      input: (cursor: number | undefined) => ({
        wordSlug: wordDetailSlug,
        cursor,
      }),
      initialPageParam: undefined,
      getNextPageParam: ({ nextCursor }) => nextCursor,
      enabled: !!wordDetailSlug,
    }),
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

  function renderContent() {
    if (getWordCommentsQuery.isFetching) {
      return <Spinner />;
    }

    if (allComments.length === 0) {
      return (
        <div className="mb-4 flex flex-col items-center justify-center gap-2 text-muted opacity-50">
          <LuIcon icon={Sofa} size={50} />
          <small>抢沙发</small>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {allComments.map((comment, index) => {
          return <WordCommentItem key={index} comment={comment} />;
        })}
        <div ref={sentryRef} className="my-1 text-center text-sm text-muted">
          共 {totalCount} 条评论
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col" ref={rootRef}>
      {renderContent()}
    </div>
  );
}
