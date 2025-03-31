import { Button } from "@heroui/react";
import { LuIcon } from "~/components/LuIcon";
import { X } from "lucide-react";
import { useSetAtom } from "jotai";
import { isWordDetailPanelDrawerOpenAtom } from "~/common/store";

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
