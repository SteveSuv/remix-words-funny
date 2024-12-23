import { twMerge, twJoin, ClassNameValue } from "tailwind-merge";

export const clsx = (...inputs: ClassNameValue[]) => {
  return twMerge(twJoin(inputs));
};
