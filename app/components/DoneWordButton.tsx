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
  const doneWordMutation = useDoneWordMutation({ wordSlug });

  const { isLogin } = useMyUserInfo();

  if (!isLogin) return null;

  const isLoading = doneWordMutation.isPending;

  return (
    <Button
      variant="light"
      isIconOnly
      size="sm"
      isLoading={isLoading}
      onPress={async () => {
        await doneWordMutation.mutateAsync();
        await onPress?.();
      }}
    >
      <LuIcon icon={Check} />
    </Button>
  );
};
