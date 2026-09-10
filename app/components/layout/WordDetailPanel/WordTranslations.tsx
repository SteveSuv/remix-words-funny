import { Chip, Separator } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { LinkWord } from "./LinkWord";
import { WordDetailSectionSkeleton } from "./WordDetailSectionSkeleton";

export function WordTranslations() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordTranslationsQuery = useQuery(
    orpc.loader.getWordTranslations.queryOptions({
      input: {
        wordSlug: wordDetailSlug,
      },
      enabled: !!wordDetailSlug,
    }),
  );

  const { wordTranslations = [] } = getWordTranslationsQuery.data || {};

  if (getWordTranslationsQuery.isFetching) return <WordDetailSectionSkeleton />;

  if (wordTranslations.length === 0) return null;

  return (
    <div>
      <Separator />
      <div className="my-4 text-xl font-medium">翻译</div>
      <div className="flex flex-col gap-2">
        {wordTranslations.map(({ id, pos, transCn, transEn }) => (
          <div key={id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Chip size="sm" variant="soft" color="accent">
                {pos || "未知"}
              </Chip>
              <div>{transCn}</div>
            </div>
            <LinkWord word={transEn} />
          </div>
        ))}
      </div>
    </div>
  );
}
