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
  const { isLogin } = useMyUserInfo();
  const unDoneWordMutation = useUnDoneWordMutation({ wordSlug });

  return (
    <Button
      variant="solid"
      isIconOnly
      size="sm"
      color="success"
      isDisabled={!isLogin}
      isLoading={unDoneWordMutation.isPending}
      onPress={async () => {
        await unDoneWordMutation.mutateAsync();
        await onPress?.();
      }}
    >
      <LuIcon icon={Check} />
    </Button>
  );
};
