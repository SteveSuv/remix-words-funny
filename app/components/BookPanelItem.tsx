import { Button, cn, Image } from "@heroui/react";
import { useSetAtom } from "jotai";
import { Star } from "lucide-react";
import { href, Link, useParams, useRevalidator } from "react-router";
import {
  isBooksPanelDrawerOpenAtom,
  searchWordAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import { IBookItem } from "~/common/types";
import { useStarBookMutation } from "~/hooks/request/mutation/useStarBookMutation";
import { useUnStarBookMutation } from "~/hooks/request/mutation/useUnStarBookMutation";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "./LuIcon";

const ratio = 251 / 388;

export const BookPanelItem = ({
  item,
  isBookStar,
}: {
  item: IBookItem;
  isBookStar: boolean;
}) => {
  const { bookSlug = "" } = useParams<{ bookSlug: string }>();
  const setSearchWord = useSetAtom(searchWordAtom);
  const setWordDetailSlug = useSetAtom(wordDetailSlugAtom);
  const setIsBooksPanelDrawerOpen = useSetAtom(isBooksPanelDrawerOpenAtom);
  const { revalidate } = useRevalidator();
  const { isLogin } = useMyUserInfo();

  const isActive = bookSlug === item.slug;

  const starBookMutation = useStarBookMutation({ bookSlug: item.slug });
  const unStarBookMutation = useUnStarBookMutation({ bookSlug: item.slug });

  return (
    <Link to={href("/:bookSlug/words", { bookSlug: item.slug })}>
      <div
        className={cn(
          "group border-foreground-100 hover:bg-primary-50 flex h-20 items-center justify-between border-b px-4",
          isActive && "border-b-primary bg-primary-50",
        )}
        onClick={() => {
          setSearchWord("");
          setWordDetailSlug("");
          setIsBooksPanelDrawerOpen(false);
        }}
      >
        <div className="flex items-center gap-4">
          <Image
            radius="none"
            alt={item.slug}
            src={`/books/${item.slug}.webp`}
            height={60}
            width={60 * ratio}
          />
          <div className="flex flex-col">
            <div className="w-[200px] truncate">{item.name}</div>
            <small className="text-primary">{item.wordsCount}个单词</small>
          </div>
        </div>
        {isLogin && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={async () => {
              if (isBookStar) {
                await unStarBookMutation.mutateAsync();
              } else {
                await starBookMutation.mutateAsync();
              }
              revalidate();
            }}
          >
            <LuIcon
              className={cn(
                "text-foreground-500",
                isBookStar && "fill-warning",
              )}
              icon={Star}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
