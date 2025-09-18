import { Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";

export const WordSentences = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordSentencesQuery = useQuery(
    trpcClient.loader.getWordSentences.queryOptions(
      {
        wordSlug: wordDetailSlug,
      },
      { enabled: !!wordDetailSlug },
    ),
  );

  const { wordSentences = [] } = getWordSentencesQuery.data || {};

  if (getWordSentencesQuery.isFetching) return <SkeletonBox />;

  if (wordSentences.length === 0) return null;

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">句子</div>
      <div className="flex flex-col gap-2">
        {wordSentences.map(({ id, content, transCn }) => (
          <div key={id} className="flex flex-col gap-2">
            <LinkWord word={content} />
            <div>{transCn}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
