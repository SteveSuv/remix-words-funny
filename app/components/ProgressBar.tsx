import { Progress } from "@nextui-org/react";
import { useNavigation } from "react-router";

export const ProgressBar = () => {
  const { state } = useNavigation();

  const getValue = () => {
    if (state === "submitting") return 50;
    if (state === "loading") return 100;
    return 0;
  };

  const value = getValue();

  return (
    <Progress
      aria-label="Loading..."
      style={{ opacity: !!value ? 1 : 0 }}
      className="fixed inset-0 z-50 h-[2px]"
      value={value}
    />
  );
};
