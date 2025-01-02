import { Spinner } from "@nextui-org/react";
import { LuIcon } from "./LuIcon";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { SearchX } from "lucide-react";
import { WordTranslations } from "./WordTranslations";
import { WordSynonyms } from "./WordSynonyms";
import { WordCognates } from "./WordCognates";
import { WordPhrases } from "./WordPhrases";
import { WordSentences } from "./WordSentences";
import { useGetWordDetailQuery } from "~/hooks/request/query/useGetWordDetailQuery";
import { Link } from "react-router";
import { searchWordAtom } from "./SearchBar";
import { WordAudioButton } from "./WordAudioButton";
import { WordCommentForm } from "./WordCommentForm";
import { WordCommentsList } from "./WordCommentsList";

export const wordDetailSlugAtom = atom("");

export const WordDetailPanel = () => {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
  const setSearchWord = useSetAtom(searchWordAtom);

  const getWordDetailQuery = useGetWordDetailQuery({
    wordSlug: wordDetailSlug,
  });

  const { wordDetail } = getWordDetailQuery?.data || {};

  if (getWordDetailQuery.isFetching) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Spinner size="lg" />
        <div className="mt-4 text-foreground-400">查询中...</div>
      </div>
    );
  }

  if (!wordDetail)
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <LuIcon size={100} className="text-foreground-300" icon={SearchX} />
        <div className="mt-2 text-foreground-400">请选择查询词</div>
      </div>
    );

  const renderWordDetail = () => {
    const {
      Word: { word, remember, usPronounce, bookSlug },
      Book: { name: bookName },
    } = wordDetail;

    return (
      <>
        <div className="font-Merriweather text-4xl">{word}</div>

        <Link
          to={`/${bookSlug}/words`}
          onClick={() => {
            setSearchWord("");
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
          <div className="box-content border border-primary bg-primary-50 p-2">
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
