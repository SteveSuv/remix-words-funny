import { Button, Spinner } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Check } from "lucide-react";
import { orpc } from "~/common/orpcClient";
import { isSignInModalOpenAtom } from "~/common/store";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";
import { LuIcon } from "~/components/common/LuIcon";

export function WordMasterButton({
  isDone,
  wordSlug,
  onChanged,
}: {
  isDone: boolean;
  wordSlug: string;
  onChanged?: () => unknown | Promise<unknown>;
}) {
  const { isLogin } = useMyUserInfo();
  const setIsSignInModalOpen = useSetAtom(isSignInModalOpenAtom);
  const doneWordMutation = useMutation(orpc.action.doneWord.mutationOptions());
  const unDoneWordMutation = useMutation(
    orpc.action.unDoneWord.mutationOptions(),
  );
  const isPending = doneWordMutation.isPending || unDoneWordMutation.isPending;

  return (
    <Button
      variant={isDone ? "primary" : "outline"}
      isIconOnly
      size="sm"
      isDisabled={isPending}
      onPress={async () => {
        if (!isLogin) {
          setIsSignInModalOpen(true);
          return;
        }

        if (isDone) {
          await unDoneWordMutation.mutateAsync({ wordSlug });
        } else {
          await doneWordMutation.mutateAsync({ wordSlug });
        }

        await onChanged?.();
      }}
    >
      {isPending ? <Spinner size="sm" /> : <LuIcon icon={Check} />}
    </Button>
  );
}
