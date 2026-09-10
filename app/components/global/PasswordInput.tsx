import { FieldError, Input, Label, TextField } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "className"> & {
  errorMessage?: ReactNode;
  label?: ReactNode;
};

export function PasswordInput({
  errorMessage,
  label = "密码",
  ...props
}: PasswordInputProps) {
  return (
    <TextField fullWidth isInvalid={!!errorMessage} variant="secondary">
      {label && <Label>{label}</Label>}
      <Input
        minLength={8}
        maxLength={30}
        placeholder="请输入密码"
        type="password"
        {...props}
      />
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  );
}
