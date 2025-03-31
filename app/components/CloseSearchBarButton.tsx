import { Button } from "@heroui/react";
import { LuIcon } from "~/components/LuIcon";
import { X } from "lucide-react";
import { useSetAtom } from "jotai";
import { isSearchBarOpenAtom, searchWordAtom } from "~/common/store";

export const CloseSearchBarButton = () => {
  const setIsSearchBarOpenAtom = useSetAtom(isSearchBarOpenAtom);
  const setSearchWord = useSetAtom(searchWordAtom);

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => {
        setSearchWord("");
        setIsSearchBarOpenAtom(false);
      }}
    >
      <LuIcon icon={X} />
    </Button>
  );
};
