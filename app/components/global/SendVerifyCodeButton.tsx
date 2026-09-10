import { Button, toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { useCountdown } from "usehooks-ts";
import { orpc } from "~/common/orpcClient";

export function SendVerifyCodeButton({ form }: { form: UseFormReturn<any> }) {
  const email = form.watch("email");

  const [count, Countdown] = useCountdown({ countStart: 60, countStop: 0 });

  const showCountDown = count > 0 && count < 60;

  const sendVerifyCodeMutation = useMutation(
    orpc.action.sendVerifyCode.mutationOptions(),
  );

  if (showCountDown) {
    return (
      <Button variant="outline" fullWidth isDisabled>
        {count}秒后可重新发送
      </Button>
    );
  }

  if (
    sendVerifyCodeMutation.isPending ||
    (sendVerifyCodeMutation.isSuccess && count === 60)
  ) {
    return (
      <Button variant="outline" fullWidth isDisabled>
        正在发送验证码...
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      fullWidth
      isDisabled={!!form.formState.errors.email || !email}
      onPress={async () => {
        await sendVerifyCodeMutation.mutateAsync({ email });
        Countdown.startCountdown();
        toast.success("验证码已发送至邮箱");
      }}
    >
      发送邮箱验证码
    </Button>
  );
}
