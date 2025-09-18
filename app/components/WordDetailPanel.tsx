import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { SearchX } from "lucide-react";
import { href, Link } from "react-router";
import {
  isWordDetailPanelDrawerOpenAtom,
  searchWordAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import { trpcClient } from "~/common/trpc";
import { CloseWordDetailDrawerButton } from "./CloseWordDetailDrawerButton";
import { LuIcon } from "./LuIcon";
import { WordAudioButton } from "./WordAudioButton";
import { WordCognates } from "./WordCognates";
import { WordCommentForm } from "./WordCommentForm";
import { WordCommentsList } from "./WordCommentsList";
import { WordPhrases } from "./WordPhrases";
import { WordSentences } from "./WordSentences";
import { WordSynonyms } from "./WordSynonyms";
import { WordTranslations } from "./WordTranslations";

export const WordDetailPanel = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
  const setSearchWord = useSetAtom(searchWordAtom);
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );

  const getWordDetailQuery = useQuery(
    trpcClient.loader.getWordDetail.queryOptions(
      {
        wordSlug: wordDetailSlug,
      },
      { enabled: !!wordDetailSlug },
    ),
  );

  const { wordDetail } = getWordDetailQuery?.data || {};

  if (getWordDetailQuery.isFetching) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Spinner size="lg" />
        <div className="text-foreground-400 mt-4 font-light">查询中...</div>
      </div>
    );
  }

  if (!wordDetail)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <LuIcon size={100} className="text-foreground-300" icon={SearchX} />
        <div className="text-foreground-400 mt-2">请选择查询词</div>
      </div>
    );

  const renderWordDetail = () => {
    const {
      Word: { word, remember, usPronounce, bookSlug },
      Book: { name: bookName },
    } = wordDetail;

    return (
      <>
        <div className="flex items-center justify-between">
          <div className="font-merriweathers text-4xl">{word}</div>
          <CloseWordDetailDrawerButton />
        </div>

        <Link
          to={href("/:bookSlug/words", { bookSlug })}
          onClick={() => {
            setSearchWord("");
            setIsWordDetailPanelDrawerOpen(false);
          }}
          className="text-foreground-400 hover:underline"
        >
          <small>{bookName}</small>
        </Link>

        {!!usPronounce && (
          <div className="flex items-center gap-2">
            <WordAudioButton word={word} />
            <div>/{usPronounce}/</div>
          </div>
        )}

        {!!remember && (
          <div className="border-primary bg-primary-50 box-content rounded-lg border p-2">
            {remember}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {renderWordDetail()}
      <WordTranslations />
      <WordPhrases />
      <WordSentences />
      <WordSynonyms />
      <WordCognates />
      <WordCommentForm />
      <WordCommentsList />
    </div>
  );
};
