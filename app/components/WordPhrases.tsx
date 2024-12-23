import { Divider } from "@nextui-org/react";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";
import { useGetWordPhrasesQuery } from "~/hooks/request/query/useGetWordPhrasesQuery";

export const WordPhrases = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordPhrasesQuery = useGetWordPhrasesQuery({
    wordSlug: wordDetailSlug,
  });

  const { wordPhrases = [] } = getWordPhrasesQuery.data || {};

  if (getWordPhrasesQuery.isFetching) {
    return <SkeletonBox />;
  }

  if (wordPhrases.length === 0) {
    return null;
  }

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">短语</div>
      <div className="flex flex-col gap-2">
        {wordPhrases.map((e, i) => {
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
