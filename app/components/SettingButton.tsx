import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { Settings } from "lucide-react";
import { isSettingModalOpenAtom } from "~/common/store";
import { LuIcon } from "./LuIcon";

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
