import { Button, Image } from "@nextui-org/react";
import { useAppTheme } from "~/hooks/useAppTheme";

export const GithubIconButton = () => {
  const { isDarkMode } = useAppTheme();

  return (
    <a href="https://github.com/SteveSuv/remix-words-funny" target="_blank">
      <Button variant="light" isIconOnly>
        <Image
          alt="github"
          src={isDarkMode ? "/svgs/github_dark.svg" : "/svgs/github_light.svg"}
          width={18}
        />
      </Button>
    </a>
  );
};
