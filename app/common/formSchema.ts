import { z } from "zod";

export const email = z.string().email("无效的邮箱格式");

export const password = z
  .string()
  .min(8, "密码长度不能少于8位")
  .max(30, "密码长度不能多于30位");

export const keepAlive = z.boolean();

export const verifyCode = z.string().length(6, "验证码为6位数字");

export const name = z
  .string()
  .min(3, "名字长度不能少于3位")
  .max(16, "名字长度不能多于16位");

export const signInForm = z.object({ email, password, keepAlive });

const updatePasswordFormFields = {
  email,
  password,
  password2: password,
  verifyCode,
};

const signUpFormFields = { ...updatePasswordFormFields, name };

export const signUpForm = z
  .object(signUpFormFields)
  .refine((data) => data.password === data.password2, {
    message: "两次密码输入不一致",
    path: ["password2"],
  });

export const updatePasswordForm = z
  .object(updatePasswordFormFields)
  .refine((data) => data.password === data.password2, {
    message: "两次密码输入不一致",
    path: ["password2"],
  });
