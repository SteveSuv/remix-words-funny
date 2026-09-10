import { useTheme } from "@heroui/react";

enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export function useAppTheme() {
  const { resolvedTheme, setTheme } = useTheme(Theme.LIGHT);

  const isDarkMode = resolvedTheme === Theme.DARK;

  function toggleTheme() {
    setTheme(isDarkMode ? Theme.LIGHT : Theme.DARK);
  }

  return { isDarkMode, toggleTheme, setTheme };
}
