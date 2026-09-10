import { Skeleton, Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useParams } from "react-router";
import { orpc } from "~/common/orpcClient";
import { Empty } from "~/components/common/Empty";
import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";
import { WordListIem } from "./WordListIem";

export function SearchWordsList() {
  const { bookSlug = "" } = useParams<{ bookSlug: string }>();

  const { searchWord } = useDebounceSearchWord();

  const getWordsOfKeywordQuery = useInfiniteQuery(
    orpc.loader.getWordsOfKeyword.infiniteOptions({
      input: (cursor: number | undefined) => ({ keyword: searchWord, cursor }),
      initialPageParam: undefined,
      getNextPageParam: ({ nextCursor }) => nextCursor,
      enabled: !!searchWord,
    }),
  );

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: getWordsOfKeywordQuery.isFetching,
    hasNextPage: getWordsOfKeywordQuery.hasNextPage,
    onLoadMore: getWordsOfKeywordQuery.fetchNextPage,
    disabled: !!getWordsOfKeywordQuery.error,
    rootMargin: "0px 0px 200px 0px",
  });

  const allWords =
    getWordsOfKeywordQuery.data?.pages.map((e) => e.wordsOfKeyword).flat(2) ||
    [];
  const totalCount = allWords.length;

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "end" });
  }, [bookSlug, topRef]);

  function renderContent() {
    if (allWords.length === 0) {
      if (getWordsOfKeywordQuery.isFetching) {
        return (
          <div className="divide-separator divide-y">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                className="flex h-20 items-center justify-between px-6"
                key={index}
              >
                <div className="space-y-2">
                  <Skeleton className="h-9 w-56 rounded-sm" />
                  <Skeleton className="h-3 w-28 rounded-sm" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            ))}
          </div>
        );
      }

      return <Empty label="没有找到单词" />;
    }

    return (
      <div className="flex w-full flex-col">
        {allWords.map((item, index) => {
          return <WordListIem item={item} key={index} />;
        })}
        {renderEnd()}
      </div>
    );
  }

  function renderEnd() {
    if (getWordsOfKeywordQuery.isFetchingNextPage) {
      return (
        <div className="my-6 flex items-center justify-center">
          <Spinner />
        </div>
      );
    }

    return (
      <div ref={sentryRef} className="my-6 text-center text-sm text-muted">
        共 {totalCount} 个结果
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto" ref={rootRef}>
      <div ref={topRef} />
      {renderContent()}
    </div>
  );
}
