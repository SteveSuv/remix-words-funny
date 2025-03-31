import { Button } from "@heroui/react";
import { LuIcon } from "~/components/LuIcon";
import { X } from "lucide-react";
import { useSetAtom } from "jotai";
import { isBooksPanelDrawerOpenAtom } from "~/common/store";

export const CloseMenuButton = () => {
  const setIsBooksPanelDrawerOpen = useSetAtom(isBooksPanelDrawerOpenAtom);

  return (
    <Button
      isIconOnly
      variant="light"
      className="flex xl:hidden"
      onPress={() => {
        setIsBooksPanelDrawerOpen(false);
      }}
    >
      <LuIcon icon={X} />
    </Button>
  );
};
