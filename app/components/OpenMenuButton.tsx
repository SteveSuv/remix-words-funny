import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { Menu } from "lucide-react";
import { isBooksPanelDrawerOpenAtom } from "~/common/store";
import { LuIcon } from "~/components/LuIcon";

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
