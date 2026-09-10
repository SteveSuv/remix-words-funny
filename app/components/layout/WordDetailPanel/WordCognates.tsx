import { Chip, Separator } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { LinkWord } from "./LinkWord";
import { WordDetailSectionSkeleton } from "./WordDetailSectionSkeleton";

export function WordCognates() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordCognatesQuery = useQuery(
    orpc.loader.getWordCognates.queryOptions({
      input: { wordSlug: wordDetailSlug },
      enabled: !!wordDetailSlug,
    }),
  );

  const { wordCognates = [] } = getWordCognatesQuery.data || {};

  if (getWordCognatesQuery.isFetching) return <WordDetailSectionSkeleton />;

  if (wordCognates.length === 0) return null;

  return (
    <div>
      <Separator />
      <div className="my-4 text-xl font-medium">同根词</div>
      <div className="flex flex-col gap-2">
        {wordCognates.map(({ id, pos, content, transCn }) => (
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
