import { DoneWordButton } from "./DoneWordButton";
import { UnDoneWordButton } from "./UnDoneWordButton";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { useSetAtom } from "jotai";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { Button } from "@heroui/react";
import { useGetIsWordDoneQuery } from "~/hooks/request/query/useGetIsWordDoneQuery";
import { IWordItem } from "~/common/types";

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

    if (getIsWordDoneQuery.isFetching) {
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
      className="border-foreground-100 hover:bg-primary-50 box-border flex h-20 cursor-pointer items-center justify-between border-b px-8"
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
