import { Button, Input, InputProps } from "@nextui-org/react";
import { LuIcon } from "./LuIcon";
import { forwardRef, Ref, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = forwardRef(
  (props: InputProps, ref: Ref<HTMLInputElement>) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        minLength={8}
        maxLength={30}
        label="密码"
        placeholder="请输入密码"
        type={showPassword ? "text" : "password"}
        variant="bordered"
        endContent={
          <Button
            variant="light"
            size="sm"
            isIconOnly
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            <LuIcon icon={showPassword ? EyeOff : Eye} />
          </Button>
        }
        {...props}
        ref={ref}
      />
    );
  },
);
