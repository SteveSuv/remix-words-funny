import { Skeleton, Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useParams } from "react-router";
import { listTabAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { ListTabType } from "~/common/types";
import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { Empty } from "~/components/common/Empty";
import { WordListIem } from "./WordListIem";

export function BookWordsList() {
  const { bookSlug = "" } = useParams<{ bookSlug: string }>();
  const { searchWord } = useDebounceSearchWord();
  const { isLogin } = useMyUserInfo();
  const listTab = useAtomValue(listTabAtom);

  const getWordsOfBookQuery = useInfiniteQuery(
    orpc.loader.getWordsOfBook.infiniteOptions({
      input: (cursor: number | undefined) => ({ bookSlug, cursor }),
      initialPageParam: undefined,
      getNextPageParam: ({ nextCursor }) => nextCursor,
      enabled: !!bookSlug && !searchWord && listTab === ListTabType.ALL,
    }),
  );

  const getDoneWordsOfBookQuery = useInfiniteQuery(
    orpc.loader.getDoneWordsOfBook.infiniteOptions({
      input: (cursor: number | undefined) => ({ bookSlug, cursor }),
      initialPageParam: undefined,
      getNextPageParam: ({ nextCursor }) => nextCursor,
      enabled:
        isLogin && !!bookSlug && !searchWord && listTab === ListTabType.DONE,
    }),
  );

  const getUnDoneWordsOfBook = useInfiniteQuery(
    orpc.loader.getUnDoneWordsOfBook.infiniteOptions({
      input: (cursor: number | undefined) => ({ bookSlug, cursor }),
      initialPageParam: undefined,
      getNextPageParam: ({ nextCursor }) => nextCursor,
      enabled:
        isLogin && !!bookSlug && !searchWord && listTab === ListTabType.UNDONE,
    }),
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
  const isWordsQueryEnabled =
    !!bookSlug && !searchWord && (listTab === ListTabType.ALL || isLogin);

  useEffect(() => {
    if (!isWordsQueryEnabled) return;

    wordsQuery.refetch();
  }, [isWordsQueryEnabled, listTab]);

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

  function renderEnd() {
    if (wordsQuery.isFetchingNextPage) {
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

  function renderContent() {
    if (wordsQueryData.length === 0) {
      if (wordsQuery.isFetching) {
        return (
          <div className="divide-separator divide-y">
            {Array.from({ length: 10 }).map((_, index) => (
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
      <div className="flex flex-col">
        {wordsQueryData.map((item, index) => {
          return <WordListIem item={item} key={index} />;
        })}
        {renderEnd()}
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
