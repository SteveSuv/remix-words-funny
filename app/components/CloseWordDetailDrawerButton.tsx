import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { X } from "lucide-react";
import { isWordDetailPanelDrawerOpenAtom } from "~/common/store";
import { LuIcon } from "~/components/LuIcon";

export const CloseWordDetailDrawerButton = () => {
  const setIsWordDetailPanelDrawerOpen = useSetAtom(
    isWordDetailPanelDrawerOpenAtom,
  );

  return (
    <Button
      isIconOnly
      variant="light"
      className="flex xl:hidden"
      onPress={() => {
        setIsWordDetailPanelDrawerOpen(false);
      }}
    >
      <LuIcon icon={X} />
    </Button>
  );
};
