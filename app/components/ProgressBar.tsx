import { Progress } from "@heroui/react";
import { useNavigation } from "react-router";

export const ProgressBar = () => {
  const { state } = useNavigation();

  const value =
    {
      idle: 0,
      submitting: 50,
      loading: 100,
    }[state] || 0;

  return (
    <Progress
      aria-label="Loading..."
      style={{ opacity: Number(value) }}
      className="fixed inset-0 z-50 h-[2px]"
      value={value}
    />
  );
};
