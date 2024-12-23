import { useTheme } from "next-themes";

export const useAppTheme = () => {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return { isDarkMode, toggleTheme, setTheme };
};
