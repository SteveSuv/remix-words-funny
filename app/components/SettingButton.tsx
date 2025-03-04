import { Button } from "@heroui/react";
import { LuIcon } from "./LuIcon";
import { Settings } from "lucide-react";
import { useSetAtom } from "jotai";
import { isSettingModalOpenAtom } from "./SettingModal";

export const SettingButton = () => {
  const setIsSettingModalOpen = useSetAtom(isSettingModalOpenAtom);

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => setIsSettingModalOpen(true)}
    >
      <LuIcon icon={Settings} />
    </Button>
  );
};
