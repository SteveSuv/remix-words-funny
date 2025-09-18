import { Chip, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { wordDetailSlugAtom } from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";

export const WordSynonyms = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordSynonymsQuery = useQuery(
    trpcClient.loader.getWordSynonyms.queryOptions(
      {
        wordSlug: wordDetailSlug,
      },
      { enabled: !!wordDetailSlug },
    ),
  );

  const { wordSynonyms = [] } = getWordSynonymsQuery.data || {};

  if (getWordSynonymsQuery.isFetching) return <SkeletonBox />;

  if (wordSynonyms.length === 0) return null;

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">同义词</div>
      <div className="flex flex-col gap-2">
        {wordSynonyms.map(({ id, pos, content, transCn }) => (
          <div key={id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Chip radius="sm" size="sm" variant="flat" color="primary">
                {pos || "unknown"}
              </Chip>
              <LinkWord word={content} />
            </div>
            <div>{transCn}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
