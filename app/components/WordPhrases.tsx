import { Divider } from "@heroui/react";
import { useAtomValue } from "jotai";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";
import { useGetWordPhrasesQuery } from "~/hooks/request/query/useGetWordPhrasesQuery";
import { wordDetailSlugAtom } from "~/common/store";

export const WordPhrases = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordPhrasesQuery = useGetWordPhrasesQuery({
    wordSlug: wordDetailSlug,
  });

  const { wordPhrases = [] } = getWordPhrasesQuery.data || {};

  if (getWordPhrasesQuery.isFetching) return <SkeletonBox />;

  if (wordPhrases.length === 0) return null;

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">短语</div>
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
};
