import { ReactNode } from "react";
import { BooksPanel } from "./BooksPanel";
import { WordDetailPanel } from "./WordDetailPanel";
import { AppHeader } from "./AppHeader";
import { IBookItem } from "~/common/types";
import { Drawer, DrawerContent } from "@heroui/react";
import { useAtom } from "jotai";
import {
  isBooksPanelDrawerOpenAtom,
  isWordDetailPanelDrawerOpenAtom,
} from "~/common/store";
import { useMobile } from "~/hooks/useMobile";

export const AppLayout = ({
  allBooks,
  starBooks,
  children,
}: {
  allBooks: IBookItem[];
  starBooks: string[];
  children: ReactNode;
}) => {
  const [isBooksPanelDrawerOpen, setIsBooksPanelDrawerOpen] = useAtom(
    isBooksPanelDrawerOpenAtom,
  );
  const [isWordDetailPanelDrawerOpen, setIsWordDetailPanelDrawerOpen] = useAtom(
    isWordDetailPanelDrawerOpenAtom,
  );

  const { isMobile } = useMobile();

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {isMobile && (
        <Drawer
          placement="left"
          backdrop="blur"
          className="block xl:hidden"
          isOpen={isBooksPanelDrawerOpen}
          onOpenChange={setIsBooksPanelDrawerOpen}
          hideCloseButton
        >
          <DrawerContent>
            <div className="bg-foreground-50 shadow-small h-screen">
              <AppHeader />
              <div className="h-[calc(100vh-80px)] overflow-y-scroll">
                <BooksPanel allBooks={allBooks} starBooks={starBooks} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <div className="bg-foreground-50 shadow-small hidden h-screen w-[350px] xl:block">
        <AppHeader />
        <div className="h-[calc(100vh-80px)] overflow-y-scroll">
          <BooksPanel allBooks={allBooks} starBooks={starBooks} />
        </div>
      </div>

      <div className="flex w-screen xl:w-[calc(100vw-350px-400px)]">
        {children}
      </div>

      {isMobile && (
        <Drawer
          size="2xl"
          placement="bottom"
          backdrop="blur"
          className="block xl:hidden"
          hideCloseButton
          isOpen={isWordDetailPanelDrawerOpen}
          onOpenChange={setIsWordDetailPanelDrawerOpen}
        >
          <DrawerContent>
            <div className="bg-foreground-50 shadow-small z-10 h-screen overflow-y-scroll">
              <WordDetailPanel />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <div className="bg-foreground-50 shadow-small z-10 hidden h-screen w-[400px] overflow-y-scroll xl:block">
        <WordDetailPanel />
      </div>
    </main>
  );
};
