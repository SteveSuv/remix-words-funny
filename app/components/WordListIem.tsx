import { DoneWordButton } from "./DoneWordButton";
import { UnDoneWordButton } from "./UnDoneWordButton";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { useSetAtom } from "jotai";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { Button } from "@nextui-org/react";
import { useGetIsWordDoneQuery } from "~/hooks/request/query/useGetIsWordDoneQuery";
import * as schema from "~/.server/db/schema";

type IWordItem = {
  Book?: typeof schema.Book.$inferSelect;
  Word: typeof schema.Word.$inferSelect;
};

export const WordListIem = ({ item }: { item: IWordItem }) => {
  const setWordDetailSlug = useSetAtom(wordDetailSlugAtom);

  const {
    Book: { name: bookName } = {},
    Word: { slug: wordSlug, word },
  } = item;

  const { isLogin } = useMyUserInfo();

  const getIsWordDoneQuery = useGetIsWordDoneQuery({ wordSlug });

  const isWordDone = !!getIsWordDoneQuery.data?.isWordDone;

  const renderAction = () => {
    if (!isLogin) return null;

    if (getIsWordDoneQuery.isLoading) {
      return (
        <Button
          variant="light"
          isIconOnly
          size="sm"
          isLoading
          color="warning"
        />
      );
    }

    if (!isWordDone) {
      return (
        <DoneWordButton
          wordSlug={wordSlug}
          onPress={() => {
            getIsWordDoneQuery.refetch();
          }}
        />
      );
    }

    return (
      <UnDoneWordButton
        wordSlug={wordSlug}
        onPress={() => {
          getIsWordDoneQuery.refetch();
        }}
      />
    );
  };

  return (
    <div
      className="box-border flex h-20 cursor-pointer items-center justify-between border-b border-foreground-100 px-8 hover:bg-primary-50"
      onClick={() => {
        setWordDetailSlug(wordSlug);
      }}
    >
      <div className="flex flex-col justify-center gap-1">
        <div className="font-Merriweather text-4xl">{word}</div>
        {!!bookName && (
          <small className="text-foreground-400">{bookName}</small>
        )}
      </div>
      {renderAction()}
    </div>
  );
};
