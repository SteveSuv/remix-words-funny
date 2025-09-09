import { Button } from "@heroui/react";
import { Check } from "lucide-react";
import { useDoneWordMutation } from "~/hooks/request/mutation/useDoneWordMutation";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "./LuIcon";

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
      title={!isLogin ? "请先登录" : ""}
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
