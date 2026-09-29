import { Button, Card, Link } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { href, useNavigate } from "react-router";
import {
  isSearchBarOpenAtom,
  isWordDetailPanelDrawerOpenAtom,
  searchWordAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import { orpc } from "~/common/orpcClient";
import { Empty } from "~/components/common/Empty";
import { LuIcon } from "~/components/common/LuIcon";
import { WordAudioButton } from "./WordAudioButton";
import { WordCognates } from "./WordCognates";
import { WordComments } from "./Comment";
import { WordPhrases } from "./WordPhrases";
import { WordSentences } from "./WordSentences";
import { WordSynonyms } from "./WordSynonyms";
import { WordTranslations } from "./WordTranslations";
import { WordDetailPanelSkeleton } from "./WordDetailPanelSkeleton";

export function WordDetailPanel() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
  const setSearchWord = useSetAtom(searchWordAtom);
  const setIsSearchBarOpen = useSetAtom(isSearchBarOpenAtom);
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );
  const navigate = useNavigate();

  const getWordDetailQuery = useQuery(
    orpc.loader.getWordDetail.queryOptions({
      input: {
        wordSlug: wordDetailSlug,
      },
      enabled: !!wordDetailSlug,
    }),
  );

  const { wordDetail } = getWordDetailQuery?.data || {};

  if (!wordDetailSlug) return <Empty label="请选择查询词" size={84} />;

  function renderWordDetail() {
    if (!wordDetail) return null;

    const {
      Word: { word, remember, usPronounce, bookSlug },
      Book: { name: bookName },
    } = wordDetail;

    return (
      <>
        <div className="flex items-center justify-between">
          <div className="font-merriweathers text-4xl">{word}</div>
          <div className="flex xl:hidden">
            <Button
              isIconOnly
              variant="outline"
              onPress={() => setIsWordDetailPanelDrawerOpen(false)}
            >
              <LuIcon icon={X} />
            </Button>
          </div>
        </div>

        <Link
          onPress={() => {
            setSearchWord("");
            setIsSearchBarOpen(false);
            setIsWordDetailPanelDrawerOpen(false);
            navigate(href("/:bookSlug/words", { bookSlug }));
          }}
        >
          <small className="text-muted">{bookName}</small>
        </Link>

        {!!usPronounce && (
          <div className="flex items-center gap-2">
            <WordAudioButton word={word} />
            <div>/{usPronounce}/</div>
          </div>
        )}

        {!!remember && (
          <Card
            variant="secondary"
            className="bg-accent-soft border-accent border"
          >
            <Card.Content>{remember}</Card.Content>
          </Card>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {getWordDetailQuery.isPending && getWordDetailQuery.isFetching ? (
        <WordDetailPanelSkeleton />
      ) : (
        renderWordDetail()
      )}
      <WordTranslations />
      <WordPhrases />
      <WordSentences />
      <WordSynonyms />
      <WordCognates />
      <WordComments />
    </div>
  );
}
