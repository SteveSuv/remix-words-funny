import { Button, Input, InputProps } from "@heroui/react";
import { LuIcon } from "./LuIcon";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = (props: InputProps) => {
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
          onPress={() => {
            setShowPassword(!showPassword);
          }}
        >
          <LuIcon icon={showPassword ? EyeOff : Eye} />
        </Button>
      }
      {...props}
    />
  );
};
