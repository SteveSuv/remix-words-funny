import { Button, Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Check } from "lucide-react";
import { orpc } from "~/common/orpcClient";
import { isSignInModalOpenAtom } from "~/common/store";
import { LuIcon } from "~/components/common/LuIcon";
import { useMyUserInfo } from "~/hooks/useMyUserInfo";

export function WordMasterButton({
  isDone,
  wordSlug,
  onChanged,
}: {
  isDone: boolean;
  wordSlug: string;
  onChanged?: (isDone: boolean) => unknown | Promise<unknown>;
}) {
  const { isLogin } = useMyUserInfo();
  const queryClient = useQueryClient();
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

        const nextIsDone = !isDone;
        await setWordDoneMutation.mutateAsync({
          wordSlug,
          isDone: nextIsDone,
        });

        await onChanged?.(nextIsDone);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: orpc.loader.getWordsOfBook.key({ type: "infinite" }),
          }),
          queryClient.invalidateQueries({
            queryKey: orpc.loader.getDoneWordsOfBook.key({ type: "infinite" }),
          }),
          queryClient.invalidateQueries({
            queryKey: orpc.loader.getUnDoneWordsOfBook.key({
              type: "infinite",
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: orpc.loader.getWordsOfKeyword.key({ type: "infinite" }),
          }),
        ]);
      }}
    >
      {isPending ? <Spinner size="sm" /> : <LuIcon icon={Check} />}
    </Button>
  );
}
