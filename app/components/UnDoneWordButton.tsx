import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { trpcClient } from "~/common/trpc";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "./LuIcon";

export const UnDoneWordButton = ({
  wordSlug,
  onPress,
}: {
  wordSlug: string;
  onPress?: Function;
}) => {
  const { isLogin } = useMyUserInfo();
  const unDoneWordMutation = useMutation(
    trpcClient.action.unDoneWord.mutationOptions(),
  );

  return (
    <Button
      variant="solid"
      isIconOnly
      size="sm"
      color="success"
      isDisabled={!isLogin}
      title={!isLogin ? "请先登录" : ""}
      isLoading={unDoneWordMutation.isPending}
      onPress={async () => {
        await unDoneWordMutation.mutateAsync({ wordSlug });
        await onPress?.();
      }}
    >
      <LuIcon icon={Check} />
    </Button>
  );
};
