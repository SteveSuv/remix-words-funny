import { Divider } from "@nextui-org/react";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";
import { useGetWordSentencesQuery } from "~/hooks/request/query/useGetWordSentencesQuery";

export const WordSentences = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordSentencesQuery = useGetWordSentencesQuery({
    wordSlug: wordDetailSlug,
  });
  const { wordSentences = [] } = getWordSentencesQuery.data || {};

  if (getWordSentencesQuery.isFetching) {
    return <SkeletonBox />;
  }

  if (wordSentences.length === 0) {
    return null;
  }

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">句子</div>
      <div className="flex flex-col gap-2">
        {wordSentences.map((e, i) => {
          return (
            <div key={i} className="flex flex-col gap-2">
              <LinkWord word={e.content} />
              <div>{e.transCn}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
