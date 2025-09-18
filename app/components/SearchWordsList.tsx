import { Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { useEffect, useRef } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useParams } from "react-router";
import { trpcClient } from "~/common/trpc";
import { IPageWordsParams } from "~/common/types";
import { LuIcon } from "~/components/LuIcon";
import { WordListIem } from "~/components/WordListIem";
import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";

export const SearchWordsList = () => {
  const { bookSlug = "" } = useParams<IPageWordsParams>();

  const { searchWord } = useDebounceSearchWord();

  const getWordsOfKeywordQuery = useInfiniteQuery(
    trpcClient.loader.getWordsOfKeyword.infiniteQueryOptions(
      {
        keyword: searchWord,
      },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        enabled: !!searchWord,
      },
    ),
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

  const renderContent = () => {
    if (allWords.length === 0) {
      if (getWordsOfKeywordQuery.isFetching) {
        return (
          <div className="flex h-full flex-col items-center justify-center">
            <Spinner size="lg" />
            <div className="text-foreground-400 mt-4 font-light">查询中...</div>
          </div>
        );
      }

      return (
        <div className="flex h-full flex-col items-center justify-center">
          <LuIcon icon={SearchX} size={100} className="text-foreground-300" />
          <div className="text-foreground-400 mt-4">无结果</div>
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col">
        {allWords.map((item, index) => {
          return <WordListIem item={item} key={index} />;
        })}
        {renderEnd()}
      </div>
    );
  };

  const renderEnd = () => {
    if (getWordsOfKeywordQuery.isFetchingNextPage) {
      return (
        <div className="my-6 flex flex-col items-center justify-center">
          <Spinner />
          <div className="text-small text-foreground-400 mt-2 font-light">
            查询中...
          </div>
        </div>
      );
    }

    return (
      <div
        ref={sentryRef}
        className="text-small text-foreground-400 my-6 text-center"
      >
        共 {totalCount} 个结果
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-75px)] overflow-y-scroll" ref={rootRef}>
      <div ref={topRef} />
      {renderContent()}
    </div>
  );
};
