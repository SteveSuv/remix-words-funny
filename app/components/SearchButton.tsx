import { Button } from "@heroui/react";
import { LuIcon } from "./LuIcon";
import { Search } from "lucide-react";
import { useSetAtom } from "jotai";
import { isSearchBarOpenAtom } from "~/common/store";

export const SearchButton = () => {
  const setIsSearchBarOpenAtom = useSetAtom(isSearchBarOpenAtom);

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => {
        setIsSearchBarOpenAtom(true);
      }}
    >
      <LuIcon icon={Search} size={24} />
    </Button>
  );
};
