import {
  Button,
  Checkbox,
  Chip,
  Modal,
  Skeleton,
  Spinner,
  Tabs,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { CheckCheck } from "lucide-react";
import { useEffect, useState, type Key } from "react";
import {
  BOOK_CATALOG,
  getBookCatalogLabel,
  type BookCatalogKey,
} from "~/common/bookCatalog";
import { orpc } from "~/common/orpcClient";
import { isManageBooksModalOpenAtom } from "~/common/store";
import { LuIcon } from "~/components/common/LuIcon";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

const coverRatio = 251 / 388;

export function ManageBooksModal() {
  const [isOpen, setIsOpen] = useAtom(isManageBooksModalOpenAtom);
  const [catalogKey, setCatalogKey] = useState<BookCatalogKey>("xx");
  const [selectedBookSlugs, setSelectedBookSlugs] = useState<Set<string>>(
    new Set(),
  );
  const queryClient = useQueryClient();
  const { isLogin } = useMyUserInfo();
  const allBooksQuery = useQuery(orpc.loader.getAllBooks.queryOptions());
  const starBooksQuery = useQuery(orpc.loader.getStarBooks.queryOptions());
  const setStarBooksMutation = useMutation(
    orpc.action.setStarBooks.mutationOptions(),
  );
  const state = useOverlayState({
    isOpen,
    onOpenChange: setIsOpen,
  });

  const { allBooks = [] } = allBooksQuery.data || {};
  const starBooks = starBooksQuery.data?.starBooks;
  const selectedCatalog =
    BOOK_CATALOG.find(({ key }) => key === catalogKey) ?? BOOK_CATALOG[0];
  const visibleBooks = allBooks.filter(({ id }) =>
    selectedCatalog.bookIds.includes(id),
  );
  const isAllVisibleSelected =
    visibleBooks.length > 0 &&
    visibleBooks.every(({ slug }) => selectedBookSlugs.has(slug));
  const isLoading = allBooksQuery.isLoading || starBooksQuery.isLoading;

  useEffect(() => {
    if (!isOpen || !starBooks) return;
    setCatalogKey("xx");
    setSelectedBookSlugs(new Set(starBooks));
  }, [isOpen, starBooks]);

  if (!isLogin) return null;

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog className="h-[calc(100dvh-2rem)] sm:h-184">
            <Modal.CloseTrigger />
            <Modal.Header className="shrink-0 gap-4">
              <Modal.Heading className="pr-8">管理书籍</Modal.Heading>
              <Tabs
                aria-label="书籍分类"
                className="w-full"
                selectedKey={catalogKey}
                onSelectionChange={(key: Key) =>
                  setCatalogKey(key as BookCatalogKey)
                }
              >
                <Tabs.ListContainer className="w-full">
                  <Tabs.List>
                    {BOOK_CATALOG.map(({ key, label }) => (
                      <Tabs.Tab
                        id={key}
                        key={key}
                        className="w-auto whitespace-nowrap px-3"
                      >
                        {label}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs.ListContainer>
              </Tabs>
              <div className="flex justify-start">
                <Button
                  isDisabled={isLoading || visibleBooks.length === 0}
                  size="sm"
                  variant={isAllVisibleSelected ? "primary" : "outline"}
                  onPress={() => {
                    setSelectedBookSlugs((current) => {
                      const next = new Set(current);
                      visibleBooks.forEach(({ slug }) => {
                        if (isAllVisibleSelected) {
                          next.delete(slug);
                        } else {
                          next.add(slug);
                        }
                      });
                      return next;
                    });
                  }}
                >
                  <LuIcon icon={CheckCheck} />
                  {isAllVisibleSelected ? "取消全选" : "全选"}
                </Button>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-1 py-1">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <div
                        className="flex h-16 items-center gap-3 px-2"
                        key={index}
                      >
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-12 w-8 rounded-sm" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 rounded-sm" />
                          <Skeleton className="h-3 w-1/3 rounded-sm" />
                        </div>
                      </div>
                    ))
                  : visibleBooks.map((book) => (
                      <Checkbox
                        className="w-full"
                        isSelected={selectedBookSlugs.has(book.slug)}
                        key={book.id}
                        onChange={(isSelected) => {
                          setSelectedBookSlugs((current) => {
                            const next = new Set(current);
                            if (isSelected) {
                              next.add(book.slug);
                            } else {
                              next.delete(book.slug);
                            }
                            return next;
                          });
                        }}
                      >
                        <Checkbox.Content className="hover:bg-default-soft-hover h-16 w-full rounded-lg px-2 transition-colors">
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <img
                            alt={book.name}
                            className="rounded-sm object-cover"
                            height={48}
                            src={`/books/${book.slug}.webp`}
                            width={48 * coverRatio}
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className="block truncate text-sm font-medium"
                              title={book.name}
                            >
                              {book.name}
                            </span>
                            <span className="mt-1 flex items-center gap-1.5">
                              <Chip color="accent" size="sm" variant="soft">
                                {getBookCatalogLabel(book.id)}
                              </Chip>
                              <small className="text-muted">
                                {book.wordsCount} 个单词
                              </small>
                            </span>
                          </span>
                        </Checkbox.Content>
                      </Checkbox>
                    ))}
              </div>
            </Modal.Body>
            <Modal.Footer className="shrink-0">
              <span className="mr-auto text-sm text-muted">
                已选择 {selectedBookSlugs.size} 本
              </span>
              <Button variant="outline" onPress={() => state.close()}>
                取消
              </Button>
              <Button
                isDisabled={isLoading || setStarBooksMutation.isPending}
                onPress={async () => {
                  const bookSlugs = allBooks
                    .filter(({ slug }) => selectedBookSlugs.has(slug))
                    .map(({ slug }) => slug);
                  const data = await setStarBooksMutation.mutateAsync({
                    bookSlugs,
                  });

                  queryClient.setQueryData(
                    orpc.loader.getStarBooks.queryKey(),
                    data,
                  );
                  state.close();
                  toast.success("书籍已更新");
                  await queryClient.invalidateQueries({
                    queryKey: orpc.loader.getStarBooks.queryKey(),
                  });
                }}
              >
                {setStarBooksMutation.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  "确认选择"
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
