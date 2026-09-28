import { Chip, cn } from "@heroui/react";
import { useSetAtom } from "jotai";
import { href, useNavigate, useParams } from "react-router";
import { getBookCatalogLabel } from "~/common/bookCatalog";
import {
  isBooksPanelDrawerOpenAtom,
  isSearchBarOpenAtom,
  searchWordAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import type { IBookItem } from "~/common/types";

const ratio = 251 / 388;

export function BookPanelItem({ item }: { item: IBookItem }) {
  const { bookSlug = "" } = useParams<{ bookSlug: string }>();

  const isActive = bookSlug === item.slug;

  const navigate = useNavigate();
  const setSearchWord = useSetAtom(searchWordAtom);
  const setIsSearchBarOpen = useSetAtom(isSearchBarOpenAtom);
  const setWordDetailSlug = useSetAtom(wordDetailSlugAtom);
  const setIsBooksPanelDrawerOpen = useSetAtom(isBooksPanelDrawerOpenAtom);

  return (
    <div
      className={cn(
        "hover:bg-default-soft-hover flex h-18 cursor-pointer items-center justify-between gap-3 rounded-xl px-2 outline-none transition-all",
        isActive && "bg-accent-soft hover:bg-accent-soft",
      )}
      onClick={() => {
        const nextBookSlug = item.slug;
        setSearchWord("");
        setIsSearchBarOpen(false);
        setWordDetailSlug("");
        setIsBooksPanelDrawerOpen(false);
        navigate(href("/:bookSlug/words", { bookSlug: nextBookSlug }));
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <img
          alt={item.slug}
          className="rounded-sm object-cover"
          src={`/books/${item.slug}.webp`}
          height={56}
          width={56 * ratio}
        />
        <div className="flex min-w-0 flex-col">
          <div className="truncate font-medium" title={item.name}>
            {item.name}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Chip color="accent" size="sm" variant="soft">
              {getBookCatalogLabel(item.id)}
            </Chip>
            <small className="text-muted">{item.wordsCount} 个单词</small>
          </div>
        </div>
      </div>
    </div>
  );
}
