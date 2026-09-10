import { useMediaQuery } from "usehooks-ts";

export function useMobile() {
  const isMobile = useMediaQuery("(width < 80rem)");
  return { isMobile };
}
