import { Button } from "@nextui-org/react";
import { Check } from "lucide-react";
import { LuIcon } from "./LuIcon";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { useDoneWordMutation } from "~/hooks/request/mutation/useDoneWordMutation";

export const DoneWordButton = ({
  wordSlug,
  onPress,
}: {
  wordSlug: string;
  onPress?: Function;
}) => {
  const { isLogin } = useMyUserInfo();
  const doneWordMutation = useDoneWordMutation({ wordSlug });

  return (
    <Button
      variant="light"
      isIconOnly
      size="sm"
      isDisabled={!isLogin}
      isLoading={doneWordMutation.isPending}
      onPress={async () => {
        await doneWordMutation.mutateAsync();
        await onPress?.();
      }}
    >
      <LuIcon icon={Check} />
    </Button>
  );
};
