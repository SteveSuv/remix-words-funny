import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { X } from "lucide-react";
import { isSearchBarOpenAtom, searchWordAtom } from "~/common/store";
import { LuIcon } from "~/components/LuIcon";

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
