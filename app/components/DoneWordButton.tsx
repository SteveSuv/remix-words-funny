import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { trpcClient } from "~/common/trpc";
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
  const doneWordMutation = useMutation(
    trpcClient.action.doneWord.mutationOptions(),
  );

  return (
    <Button
      variant="light"
      isIconOnly
      size="sm"
      isDisabled={!isLogin}
      title={!isLogin ? "请先登录" : ""}
      isLoading={doneWordMutation.isPending}
      onPress={async () => {
        await doneWordMutation.mutateAsync({ wordSlug });
        await onPress?.();
      }}
    >
      <LuIcon icon={Check} />
    </Button>
  );
};
