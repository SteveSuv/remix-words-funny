import { Button, Card, Link, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { href, useNavigate } from "react-router";
import {
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

export function WordDetailPanel() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);
  const setSearchWord = useSetAtom(searchWordAtom);
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

  if (getWordDetailQuery.isFetching) {
    return (
      <div className="space-y-5 p-4">
        <div className="space-y-3">
          <Skeleton className="h-12 w-52 rounded-sm" />
          <Skeleton className="h-4 w-36 rounded-sm" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-md" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="space-y-3" key={index}>
            <Skeleton className="h-5 w-24 rounded-sm" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (!wordDetail) return <Empty label="请选择查询词" size={84} />;

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
      {renderWordDetail()}
      <WordTranslations />
      <WordPhrases />
      <WordSentences />
      <WordSynonyms />
      <WordCognates />
      <WordComments />
    </div>
  );
}
