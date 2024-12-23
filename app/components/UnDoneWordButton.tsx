import { Button } from "@nextui-org/react";
import { Check } from "lucide-react";
import { LuIcon } from "./LuIcon";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { useUnDoneWordMutation } from "~/hooks/request/mutation/useUnDoneWordMutation";

export const UnDoneWordButton = ({
  wordSlug,
  onPress,
}: {
  wordSlug: string;
  onPress?: Function;
}) => {
  const unDoneWordMutation = useUnDoneWordMutation({ wordSlug });

  const { isLogin } = useMyUserInfo();

  if (!isLogin) return null;

  const isLoading = unDoneWordMutation.isPending;

  return (
    <Button
      variant="solid"
      isIconOnly
      size="sm"
      color="success"
      isLoading={isLoading}
      onPress={async () => {
        await unDoneWordMutation.mutateAsync();
        await onPress?.();
      }}
    >
      <LuIcon icon={Check} />
    </Button>
  );
};
