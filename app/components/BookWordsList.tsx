import { Spinner } from "@heroui/react";
import { useParams } from "react-router";
import { SearchX } from "lucide-react";
import { trpcClient } from "~/common/trpc";
import { LuIcon } from "~/components/LuIcon";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useInfiniteQuery } from "@tanstack/react-query";
import { WordListIem } from "~/components/WordListIem";
import { useEffect, useRef } from "react";
import { useDebounceSearchWord } from "~/hooks/useDebounceSearchWord";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { listTabAtom, ListTabType } from "./ListTabs";
import { useAtomValue } from "jotai";
import { IPageWordsParams } from "~/common/types";

const pageSize = 20;

export const BookWordsList = () => {
  const { bookSlug = "" } = useParams<IPageWordsParams>();
  const { searchWord } = useDebounceSearchWord();
  const { isLogin } = useMyUserInfo();
  const listTab = useAtomValue(listTabAtom);

  const getWordsOfBookQuery = useInfiniteQuery({
    queryKey: ["getWordsOfBook", bookSlug],
    queryFn: async ({ pageParam }) => {
      return trpcClient.loader.getWordsOfBook.query({
        bookSlug,
        offset: pageSize * pageParam,
        limit: pageSize,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.wordsOfBook.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    select(data) {
      return data.pages.map((e) => e.wordsOfBook);
    },
    enabled: !!bookSlug && !searchWord && listTab === ListTabType.ALL,
  });

  const getDoneWordsOfBookQuery = useInfiniteQuery({
    queryKey: ["getDoneWordsOfBook", bookSlug, listTab],
    queryFn: async ({ pageParam }) => {
      return trpcClient.loader.getDoneWordsOfBook.query({
        bookSlug,
        offset: pageSize * pageParam,
        limit: pageSize,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.doneWordsOfBook.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    select(data) {
      return data.pages.map((e) => e.doneWordsOfBook);
    },
    enabled:
      isLogin && !!bookSlug && !searchWord && listTab === ListTabType.DONE,
  });

  const getUnDoneWordsOfBook = useInfiniteQuery({
    queryKey: ["getUnDoneWordsOfBook", bookSlug, listTab],
    queryFn: async ({ pageParam }) => {
      return trpcClient.loader.getUnDoneWordsOfBook.query({
        bookSlug,
        offset: pageSize * pageParam,
        limit: pageSize,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.unDoneWordsOfBook.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    select(data) {
      return data.pages.map((e) => e.unDoneWordsOfBook);
    },
    enabled:
      isLogin && !!bookSlug && !searchWord && listTab === ListTabType.UNDONE,
  });

  const wordsQueryMap = {
    [ListTabType.ALL]: getWordsOfBookQuery,
    [ListTabType.DONE]: getDoneWordsOfBookQuery,
    [ListTabType.UNDONE]: getUnDoneWordsOfBook,
  };

  const wordsQuery = wordsQueryMap[listTab];

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

  const showWordsList = wordsQuery.data || [];
  const allWords = showWordsList.flat(2);
  const totalCount = allWords.length;

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "end" });
  }, [bookSlug, topRef]);

  const renderContent = () => {
    if (allWords.length === 0) {
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
        {allWords.map((item, index) => {
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
