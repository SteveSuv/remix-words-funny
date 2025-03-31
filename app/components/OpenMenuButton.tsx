import { Button } from "@heroui/react";
import { LuIcon } from "~/components/LuIcon";
import { Menu } from "lucide-react";
import { useSetAtom } from "jotai";
import { isBooksPanelDrawerOpenAtom } from "~/common/store";

export const OpenMenuButton = () => {
  const setIsBooksPanelDrawerOpen = useSetAtom(isBooksPanelDrawerOpenAtom);

  return (
    <Button
      isIconOnly
      variant="light"
      className="flex xl:hidden"
      onPress={() => {
        setIsBooksPanelDrawerOpen(true);
      }}
    >
      <LuIcon icon={Menu} size={24} />
    </Button>
  );
};
