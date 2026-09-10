import { Button, cn, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Star } from "lucide-react";
import { href, useNavigate, useParams } from "react-router";
import { orpc } from "~/common/orpcClient";
import {
  isBooksPanelDrawerOpenAtom,
  isSignInModalOpenAtom,
  searchWordAtom,
  wordDetailSlugAtom,
} from "~/common/store";
import type { IBookItem } from "~/common/types";
import { LuIcon } from "~/components/common/LuIcon";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

const ratio = 251 / 388;

export function BookPanelItem({
  item,
  isBookStar,
}: {
  item: IBookItem;
  isBookStar: boolean;
}) {
  const { bookSlug = "" } = useParams<{ bookSlug: string }>();
  const queryClient = useQueryClient();
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);
  const { isLogin } = useMyUserInfo();

  const isActive = bookSlug === item.slug;

  const starBookMutation = useMutation(orpc.action.starBook.mutationOptions());
  const unStarBookMutation = useMutation(
    orpc.action.unStarBook.mutationOptions(),
  );
  const isStarPending =
    starBookMutation.isPending || unStarBookMutation.isPending;

  const navigate = useNavigate();
  const setSearchWord = useSetAtom(searchWordAtom);
  const setWordDetailSlug = useSetAtom(wordDetailSlugAtom);
  const setIsBooksPanelDrawerOpen = useSetAtom(isBooksPanelDrawerOpenAtom);

  return (
    <div
      className={cn(
        "hover:bg-default-soft-hover flex h-18 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 outline-none transition-all",
        isActive && "bg-accent-soft hover:bg-accent-soft",
      )}
      onClick={() => {
        const nextBookSlug = item.slug;
        setSearchWord("");
        setWordDetailSlug("");
        setIsBooksPanelDrawerOpen(false);
        navigate(href("/:bookSlug/words", { bookSlug: nextBookSlug }));
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
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
          <small className="text-muted">{item.wordsCount} 个单词</small>
        </div>
      </div>

      <Button
        aria-label={isBookStar ? "取消收藏" : "收藏"}
        isDisabled={isStarPending}
        isIconOnly
        size="sm"
        variant="outline"
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPress={async () => {
          if (!isLogin) {
            setIsSignInModalOpen(true);
            return;
          }

          if (isBookStar) {
            await unStarBookMutation.mutateAsync({ bookSlug: item.slug });
            toast.success("已取消收藏");
          } else {
            await starBookMutation.mutateAsync({ bookSlug: item.slug });
            toast.success("已收藏");
          }

          await queryClient.invalidateQueries({
            queryKey: orpc.loader.getStarBooks.queryKey(),
          });
        }}
      >
        <LuIcon icon={Star} fill={isBookStar ? "var(--warning)" : "none"} />
      </Button>
    </div>
  );
}
