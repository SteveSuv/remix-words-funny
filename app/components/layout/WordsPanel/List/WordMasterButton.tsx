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
  const setWordDoneMutation = useMutation(
    orpc.action.setWordDone.mutationOptions(),
  );
  const isPending = setWordDoneMutation.isPending;

  return (
    <Button
      variant={isDone ? "primary" : "outline"}
      isIconOnly
      isDisabled={isPending}
      onPress={async () => {
        if (!isLogin) {
          setIsSignInModalOpen(true);
          return;
        }

        await setWordDoneMutation.mutateAsync({
          wordSlug,
          isDone: !isDone,
        });

        await onChanged?.();
      }}
    >
      {isPending ? <Spinner size="sm" /> : <LuIcon icon={Check} />}
    </Button>
  );
}
