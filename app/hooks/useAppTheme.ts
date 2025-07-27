import { useTheme } from "next-themes";

enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export const useAppTheme = () => {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === Theme.DARK;

  const toggleTheme = () => {
    setTheme(isDarkMode ? Theme.LIGHT : Theme.DARK);
  };

  return { isDarkMode, toggleTheme, setTheme };
};
