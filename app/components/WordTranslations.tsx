import { Divider, Chip } from "@nextui-org/react";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";
import { useGetWordTranslationsQuery } from "~/hooks/request/query/useGetWordTranslationsQuery";

export const WordTranslations = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordTranslationsQuery = useGetWordTranslationsQuery({
    wordSlug: wordDetailSlug,
  });

  const { wordTranslations = [] } = getWordTranslationsQuery.data || {};

  if (getWordTranslationsQuery.isFetching) {
    return <SkeletonBox />;
  }

  if (wordTranslations.length === 0) {
    return null;
  }

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">翻译</div>
      <div className="flex flex-col gap-2">
        {wordTranslations.map((e, i) => {
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Chip radius="none" size="sm" variant="flat" color="primary">
                  {e.pos || "unknown"}
                </Chip>
                <div>{e.transCn}</div>
              </div>
              <LinkWord word={e.transEn} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
