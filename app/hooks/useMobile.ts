import { useMediaQuery } from "usehooks-ts";

export const useMobile = () => {
  const isMobile = useMediaQuery("(width < 80rem)");
  return { isMobile };
};
