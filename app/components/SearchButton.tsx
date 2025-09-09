import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { Search } from "lucide-react";
import { isSearchBarOpenAtom } from "~/common/store";
import { LuIcon } from "./LuIcon";

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
