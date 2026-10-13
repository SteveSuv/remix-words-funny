import { Button, Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Sofa } from "lucide-react";
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
      initialPageParam: 0,
      getNextPageParam: ({ nextCursor }) => nextCursor,
      enabled: !!wordDetailSlug,
    }),
  );

  const allComments =
    getWordCommentsQuery.data?.pages.map((e) => e.wordComments).flat(2) || [];

  function renderContent() {
    if (getWordCommentsQuery.isPending && getWordCommentsQuery.isFetching) {
      return (
        <div className="flex w-full justify-center py-4">
          <Spinner />
        </div>
      );
    }

    if (allComments.length === 0) {
      return (
        <div className="mb-4 flex flex-col items-center justify-center gap-2 text-muted opacity-50">
          <LuIcon icon={Sofa} size={50} />
          <small>暂无评论</small>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {allComments.map((comment) => {
          return <WordCommentItem key={comment.Post.id} comment={comment} />;
        })}
        {getWordCommentsQuery.hasNextPage && (
          <Button
            fullWidth
            variant="outline"
            isDisabled={getWordCommentsQuery.isFetchingNextPage}
            onPress={() => void getWordCommentsQuery.fetchNextPage()}
          >
            {getWordCommentsQuery.isFetchingNextPage ? (
              <Spinner size="sm" />
            ) : (
              "加载更多评论"
            )}
          </Button>
        )}
      </div>
    );
  }

  return <div className="mt-4 flex flex-col">{renderContent()}</div>;
}
