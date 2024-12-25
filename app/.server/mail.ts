import nodemailer from "nodemailer";
import { IS_PROD } from "~/common/constants";

const transporter = nodemailer.createTransport({
  host: "smtp.163.com",
  port: IS_PROD ? 465 : 25,
  secure: IS_PROD,
  auth: {
    user: process.env.EMAIL_SERVER_ADDRESS,
    pass: process.env.EMAIL_SERVER_PASS,
  },
});

export const sendVerifyCodeToEmail = async ({
  email,
  verifyCode,
}: {
  email: string;
  verifyCode: string;
}) => {
  return transporter.sendMail({
    from: `"WordsFunny" <${process.env.EMAIL_SERVER_ADDRESS}>`,
    to: email,
    subject: `验证码: ${verifyCode}`,
    text: "请查收您的验证码",
    html: `您的验证码是：${verifyCode}`,
  });
};
