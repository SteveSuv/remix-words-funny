import {
  isBooksPanelDrawerOpenAtom,
  isWordDetailPanelDrawerOpenAtom,
} from "~/common/store";
import { useAtom } from "jotai";
import { useMobile } from "~/hooks/useMobile";
import { Drawer, Surface, useOverlayState } from "@heroui/react";
import { BooksPanel } from "../layout/BooksPanel";
import { WordDetailPanel } from "../layout/WordDetailPanel";

export function MobileDrawers() {
  const [isBooksPanelDrawerOpen, setIsBooksPanelDrawerOpen] = useAtom(
    isBooksPanelDrawerOpenAtom,
  );
  const booksPanelDrawerState = useOverlayState({
    isOpen: isBooksPanelDrawerOpen,
    onOpenChange: setIsBooksPanelDrawerOpen,
  });

  const [isWordDetailPanelDrawerOpen, setIsWordDetailPanelDrawerOpen] = useAtom(
    isWordDetailPanelDrawerOpenAtom,
  );
  const wordDetailDrawerState = useOverlayState({
    isOpen: isWordDetailPanelDrawerOpen,
    onOpenChange: setIsWordDetailPanelDrawerOpen,
  });

  const { isMobile } = useMobile();

  return (
    <>
      {isMobile && (
        <Drawer state={booksPanelDrawerState}>
          <Drawer.Backdrop variant="blur">
            <Drawer.Content className="w-82.5" placement="left">
              <Drawer.Dialog className="p-0">
                <Surface className="flex h-screen flex-col">
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <BooksPanel />
                  </div>
                </Surface>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      )}

      {isMobile && (
        <Drawer state={wordDetailDrawerState}>
          <Drawer.Backdrop variant="blur">
            <Drawer.Content placement="bottom">
              <Drawer.Dialog className="px-0">
                <Drawer.Handle />
                <Surface className="h-dvh overflow-y-auto">
                  <WordDetailPanel />
                </Surface>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      )}
    </>
  );
}
