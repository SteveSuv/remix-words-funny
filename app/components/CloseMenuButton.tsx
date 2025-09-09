import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { X } from "lucide-react";
import { isBooksPanelDrawerOpenAtom } from "~/common/store";
import { LuIcon } from "~/components/LuIcon";

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
