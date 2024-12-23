import { Button, Image } from "@nextui-org/react";
import { Link, useParams, useRevalidator } from "react-router";
import { useSetAtom } from "jotai";
import { clsx } from "~/common/clsx";
import { searchWordAtom } from "./SearchBar";
import { wordDetailSlugAtom } from "./WordDetailPanel";
import { LuIcon } from "./LuIcon";
import { Star } from "lucide-react";
import { useGetIsBookStarQuery } from "~/hooks/request/query/useGetIsBookStarQuery";
import { useStarBookMutation } from "~/hooks/request/mutation/useStarBookMutation";
import { useUnStarBookMutation } from "~/hooks/request/mutation/useUnStarBookMutation";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export type IBookItem = {
  id: number;
  slug: string;
  cover: string;
  name: string;
  wordsCount: number;
};

const ratio = 251 / 388;

export const BookPanelItem = ({ item }: { item: IBookItem }) => {
  const { bookSlug = "" } = useParams<{ bookSlug: string }>();
  const setSearchWord = useSetAtom(searchWordAtom);
  const setWordDetailSlug = useSetAtom(wordDetailSlugAtom);
  const { revalidate } = useRevalidator();
  const { isLogin } = useMyUserInfo();

  const isActive = bookSlug === item.slug;

  const getIsBookStarQuery = useGetIsBookStarQuery({
    bookSlug: item.slug,
  });

  const isBookStar = !!getIsBookStarQuery.data?.isBookStar;

  const starBookMutation = useStarBookMutation({ bookSlug: item.slug });
  const unStarBookMutation = useUnStarBookMutation({ bookSlug: item.slug });

  return (
    <Link to={`/${item.slug}/words`}>
      <li className="list-none">
        <div
          className={clsx(
            "group flex h-20 items-center justify-between border-b border-foreground-100 px-4 hover:bg-primary-50",
            isActive && "border-b-primary bg-primary-50",
          )}
          onClick={() => {
            setSearchWord("");
            setWordDetailSlug("");
          }}
        >
          <div className="flex items-center gap-4">
            <Image src={item.cover} height={60} width={60 * ratio} />
            <div className="flex flex-col">
              <div
                className={clsx(
                  "w-[200px] truncate",
                  isBookStar && "text-warning",
                )}
              >
                {item.name}
              </div>
              <small className="text-primary">{item.wordsCount}个单词</small>
            </div>
          </div>
          {isLogin && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              isLoading={
                getIsBookStarQuery.isLoading ||
                starBookMutation.isPending ||
                unStarBookMutation.isPending
              }
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (isBookStar) {
                  await unStarBookMutation.mutateAsync();
                } else {
                  await starBookMutation.mutateAsync();
                }
                await getIsBookStarQuery.refetch();
                revalidate();
              }}
            >
              <LuIcon
                className={clsx(
                  "text-foreground-500",
                  isBookStar && "fill-warning",
                )}
                icon={Star}
              />
            </Button>
          )}
        </div>
      </li>
    </Link>
  );
};
