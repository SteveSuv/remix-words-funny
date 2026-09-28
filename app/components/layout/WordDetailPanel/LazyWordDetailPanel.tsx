import { useAtomValue } from "jotai";
import { lazy, Suspense } from "react";
import { wordDetailSlugAtom } from "~/common/store";
import { Empty } from "~/components/common/Empty";
import { WordDetailPanelSkeleton } from "./WordDetailPanelSkeleton";

const WordDetailPanel = lazy(() =>
  import("./index").then((module) => ({ default: module.WordDetailPanel })),
);

export function LazyWordDetailPanel() {
  const wordDetailSlug = useAtomValue(wordDetailSlugAtom);

  if (!wordDetailSlug) return <Empty label="请选择查询词" size={84} />;

  return (
    <Suspense fallback={<WordDetailPanelSkeleton />}>
      <WordDetailPanel />
    </Suspense>
  );
}
