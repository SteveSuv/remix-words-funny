import { Link } from "@nextui-org/react";
import { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { useCountdown } from "usehooks-ts";
import { useSendVerifyCodeMutation } from "~/hooks/request/mutation/useSendVerifyCodeMutation";

export const SendVerifyCodeButton = ({
  form,
}: {
  form: UseFormReturn<any>;
}) => {
  const email = form.watch("email");

  const [count, Countdown] = useCountdown({ countStart: 60, countStop: 0 });

  const showCountDown = count > 0 && count < 60;

  const sendVerifyCodeMutation = useSendVerifyCodeMutation({ email });

  if (showCountDown) {
    return (
      <Link color="primary" size="sm" isDisabled>
        {count}秒后可重新发送
      </Link>
    );
  }

  if (
    sendVerifyCodeMutation.isPending ||
    (sendVerifyCodeMutation.isSuccess && count === 60)
  ) {
    return (
      <Link color="primary" size="sm" isDisabled>
        正在发送验证码...
      </Link>
    );
  }

  return (
    <Link
      color="primary"
      size="sm"
      isDisabled={!!form.formState.errors.email || !email}
      className="cursor-pointer underline-offset-2 hover:underline"
      onPress={async () => {
        await sendVerifyCodeMutation.mutateAsync();
        Countdown.startCountdown();
        toast.success("验证码已发送至邮箱");
      }}
    >
      发送邮箱验证码
    </Link>
  );
};
