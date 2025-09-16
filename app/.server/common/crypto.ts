import crypto from "node:crypto";

export const encrypt = (text: string) => {
  return crypto
    .createHmac("sha256", process.env.CRYPTO_SECRET)
    .update(text)
    .digest("hex");
};
