import { Divider, Chip } from "@heroui/react";
import { useAtomValue } from "jotai";
import { LinkWord } from "./LinkWord";
import { SkeletonBox } from "./SkeletonBox";
import { useGetWordCognatesQuery } from "~/hooks/request/query/useGetWordCognatesQuery";
import { wordDetailSlugAtom } from "~/common/store";

export const WordCognates = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  const getWordCognatesQuery = useGetWordCognatesQuery({
    wordSlug: wordDetailSlug,
  });

  const { wordCognates = [] } = getWordCognatesQuery.data || {};

  if (getWordCognatesQuery.isFetching) {
    return <SkeletonBox />;
  }

  if (wordCognates.length === 0) {
    return null;
  }

  return (
    <div>
      <Divider />
      <div className="my-4 text-xl font-semibold">同根词</div>
      <div className="flex flex-col gap-2">
        {wordCognates.map((e, i) => {
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Chip radius="sm" size="sm" variant="flat" color="primary">
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
