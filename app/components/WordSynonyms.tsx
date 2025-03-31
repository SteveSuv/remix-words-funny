import { Divider, Chip } from "@heroui/react";
import { useAtomValue } from "jotai";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";
import { useGetWordSynonymsQuery } from "~/hooks/request/query/useGetWordSynonymsQuery";
import { wordDetailSlugAtom } from "~/common/store";

export const WordSynonyms = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordSynonymsQuery = useGetWordSynonymsQuery({
    wordSlug: wordDetailSlug,
  });

  const { wordSynonyms = [] } = getWordSynonymsQuery.data || {};

  if (getWordSynonymsQuery.isFetching) {
    return <SkeletonBox />;
  }

  if (wordSynonyms.length === 0) {
    return null;
  }

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">同义词</div>
      <div className="flex flex-col gap-2">
        {wordSynonyms.map((e, i) => {
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Chip radius="none" size="sm" variant="flat" color="primary">
                  {e.pos || "unknown"}
                </Chip>
                <LinkWord word={e.content} />
              </div>
              <div>{e.transCn}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
