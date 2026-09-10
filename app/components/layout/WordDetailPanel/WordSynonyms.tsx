import { Chip, Separator } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { LinkWord } from "./LinkWord";
import { WordDetailSectionSkeleton } from "./WordDetailSectionSkeleton";

export function WordSynonyms() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordSynonymsQuery = useQuery(
    orpc.loader.getWordSynonyms.queryOptions({
      input: {
        wordSlug: wordDetailSlug,
      },
      enabled: !!wordDetailSlug,
    }),
  );

  const { wordSynonyms = [] } = getWordSynonymsQuery.data || {};

  if (getWordSynonymsQuery.isFetching) return <WordDetailSectionSkeleton />;

  if (wordSynonyms.length === 0) return null;

  return (
    <div>
      <Separator />
      <div className="my-4 text-xl font-medium">同义词</div>
      <div className="flex flex-col gap-2">
        {wordSynonyms.map(({ id, pos, content, transCn }) => (
          <div key={id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Chip size="sm" variant="soft" color="accent">
                {pos || "未知"}
              </Chip>
              <LinkWord word={content} />
            </div>
            <div>{transCn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
