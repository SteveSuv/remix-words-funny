import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  isWordDetailPanelDrawerOpenAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import { orpc } from "~/common/orpcClient";
import type { IWordItem } from "~/common/types";
import { useMobile } from "~/hooks/useMobile";
import { WordMasterButton } from "./WordMasterButton";

export function WordListIem({ item }: { item: IWordItem }) {
  const setWordDetailSlug = useSetAtom(wordDetailSlugAtom);
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );
  const { isMobile } = useMobile();

  const {
    Book: { name: bookName } = {},
    Word: { slug: wordSlug, word },
  } = item;

  const getIsWordDoneQuery = useQuery(
    orpc.loader.getIsWordDone.queryOptions({
      input: {
        wordSlug,
      },
      enabled: !!wordSlug,
    }),
  );

  const isWordDone = !!getIsWordDoneQuery.data?.isWordDone;

  return (
    <div
      className="border-separator hover:bg-accent-soft box-border flex h-20 cursor-pointer items-center justify-between border-b px-6"
      onClick={() => {
        setWordDetailSlug(wordSlug);
        isMobile && setIsWordDetailPanelDrawerOpen(true);
      }}
    >
      <div className="flex flex-col justify-center gap-1">
        <div className="font-merriweathers text-4xl">{word}</div>
        {!!bookName && <small>{bookName}</small>}
      </div>
      <WordMasterButton
        isDone={isWordDone}
        wordSlug={wordSlug}
        onChanged={() => {
          return getIsWordDoneQuery.refetch();
        }}
      />
    </div>
  );
}
