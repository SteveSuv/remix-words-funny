import { Separator } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { LinkWord } from "./LinkWord";
import { WordDetailSectionSkeleton } from "./WordDetailSectionSkeleton";

export function WordPhrases() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordPhrasesQuery = useQuery(
    orpc.loader.getWordPhrases.queryOptions({
      input: {
        wordSlug: wordDetailSlug,
      },
      enabled: !!wordDetailSlug,
    }),
  );

  const { wordPhrases = [] } = getWordPhrasesQuery.data || {};

  if (getWordPhrasesQuery.isFetching) return <WordDetailSectionSkeleton />;

  if (wordPhrases.length === 0) return null;

  return (
    <div>
      <Separator />
      <div className="my-4 text-xl font-medium">短语</div>
      <div className="flex flex-col gap-2">
        {wordPhrases.map(({ id, content, transCn }) => (
          <div key={id} className="flex flex-col gap-2">
            <LinkWord word={content} />
            <div>{transCn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
