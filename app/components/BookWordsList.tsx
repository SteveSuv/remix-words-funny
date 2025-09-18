import { Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { SearchX } from "lucide-react";
import { useEffect, useRef } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useParams } from "react-router";
import { listTabAtom } from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { IPageWordsParams, ListTabType } from "~/common/types";
import { LuIcon } from "~/components/LuIcon";
import { WordListIem } from "~/components/WordListIem";
import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export const BookWordsList = () => {
  const { bookSlug = "" } = useParams<IPageWordsParams>();
  const { searchWord } = useDebounceSearchWord();
  const { isLogin } = useMyUserInfo();
  const listTab = useAtomValue(listTabAtom);

  const getWordsOfBookQuery = useInfiniteQuery(
    trpcClient.loader.getWordsOfBook.infiniteQueryOptions(
      {
        bookSlug,
      },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        enabled: !!bookSlug && !searchWord && listTab === ListTabType.ALL,
      },
    ),
  );

  const getDoneWordsOfBookQuery = useInfiniteQuery(
    trpcClient.loader.getDoneWordsOfBook.infiniteQueryOptions(
      {
        bookSlug,
      },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        enabled:
          isLogin && !!bookSlug && !searchWord && listTab === ListTabType.DONE,
      },
    ),
  );

  const getUnDoneWordsOfBook = useInfiniteQuery(
    trpcClient.loader.getUnDoneWordsOfBook.infiniteQueryOptions(
      {
        bookSlug,
      },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        enabled:
          isLogin &&
          !!bookSlug &&
          !searchWord &&
          listTab === ListTabType.UNDONE,
      },
    ),
  );

  const wordsQueryMap = {
    [ListTabType.ALL]: getWordsOfBookQuery,
    [ListTabType.DONE]: getDoneWordsOfBookQuery,
    [ListTabType.UNDONE]: getUnDoneWordsOfBook,
  };

  const wordsQueryDataMap = {
    [ListTabType.ALL]:
      getWordsOfBookQuery.data?.pages.map((e) => e.wordsOfBook).flat(2) || [],
    [ListTabType.DONE]:
      getDoneWordsOfBookQuery.data?.pages
        .map((e) => e.doneWordsOfBook)
        .flat(2) || [],
    [ListTabType.UNDONE]:
      getUnDoneWordsOfBook.data?.pages
        .map((e) => e.unDoneWordsOfBook)
        .flat(2) || [],
  };

  const wordsQuery = wordsQueryMap[listTab];
  const wordsQueryData = wordsQueryDataMap[listTab];

  useEffect(() => {
    wordsQuery.refetch();
  }, [listTab]);

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: wordsQuery.isFetching,
    hasNextPage: wordsQuery.hasNextPage,
    onLoadMore: wordsQuery.fetchNextPage,
    disabled: !!wordsQuery.error,
    rootMargin: "0px 0px 200px 0px",
  });

  const totalCount = wordsQueryData.length;

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "end" });
  }, [bookSlug, topRef]);

  const renderContent = () => {
    if (wordsQueryData.length === 0) {
      if (wordsQuery.isFetching) {
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
      <div className="flex flex-col">
        {wordsQueryData.map((item, index) => {
          return <WordListIem item={item} key={index} />;
        })}
        {renderEnd()}
      </div>
    );
  };

  const renderEnd = () => {
    if (wordsQuery.isFetchingNextPage) {
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
