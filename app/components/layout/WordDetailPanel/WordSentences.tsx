import { Separator } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { LinkWord } from "./LinkWord";
import { WordDetailSectionSkeleton } from "./WordDetailSectionSkeleton";

export function WordSentences() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordSentencesQuery = useQuery(
    orpc.loader.getWordSentences.queryOptions({
      input: {
        wordSlug: wordDetailSlug,
      },
      enabled: !!wordDetailSlug,
    }),
  );

  const { wordSentences = [] } = getWordSentencesQuery.data || {};

  if (getWordSentencesQuery.isFetching) return <WordDetailSectionSkeleton />;

  if (wordSentences.length === 0) return null;

  return (
    <div>
      <Separator />
      <div className="my-4 text-xl font-medium">句子</div>
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
}
