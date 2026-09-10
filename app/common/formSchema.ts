import { z } from "zod";

// 基础字段
export const email = z.email("无效的邮箱格式");

export const password = z
  .string()
  .min(8, "密码长度不能少于8位")
  .max(30, "密码长度不能多于30位");

export const verifyCode = z.string().length(6, "验证码为6位数字");

export const name = z
  .string()
  .min(3, "名字长度不能少于3位")
  .max(16, "名字长度不能多于16位");

export const comment = z
  .string()
  .min(3, "评论长度不能少于3位")
  .max(1000, "评论长度不能多于1000位");

const updatePasswordFormFields = {
  email,
  password,
  password2: password,
  verifyCode,
};

// 登录表单
export const signInForm = z.object({ email, password });

// 注册表单
export const signUpForm = z
  .object({ ...updatePasswordFormFields, name })
  .refine((data) => data.password === data.password2, {
    message: "两次密码输入不一致",
    path: ["password2"],
  });

// 重置密码表单
export const updatePasswordForm = z
  .object(updatePasswordFormFields)
  .refine((data) => data.password === data.password2, {
    message: "两次密码输入不一致",
    path: ["password2"],
  });

// 评论表单
export const commentForm = z.object({ comment });
