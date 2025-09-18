import { Chip, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";

export const WordTranslations = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordTranslationsQuery = useQuery(
    trpcClient.loader.getWordTranslations.queryOptions(
      {
        wordSlug: wordDetailSlug,
      },
      { enabled: !!wordDetailSlug },
    ),
  );

  const { wordTranslations = [] } = getWordTranslationsQuery.data || {};

  if (getWordTranslationsQuery.isFetching) return <SkeletonBox />;

  if (wordTranslations.length === 0) return null;

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">翻译</div>
      <div className="flex flex-col gap-2">
        {wordTranslations.map(({ id, pos, transCn, transEn }) => (
          <div key={id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Chip radius="sm" size="sm" variant="flat" color="primary">
                {pos || "unknown"}
              </Chip>
              <div>{transCn}</div>
            </div>
            <LinkWord word={transEn} />
          </div>
        ))}
      </div>
    </div>
  );
};
