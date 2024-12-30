import { Tooltip } from "@nextui-org/react";
import { ActivityCalendar } from "react-activity-calendar";
import { useAppTheme } from "~/hooks/useAppTheme";

export const StudyCalendar = () => {
  const { isDarkMode } = useAppTheme();

  //TODO: replace mock data to real db data
  const data = [
    {
      date: "2024-06-23",
      count: 2,
      level: 1,
    },
    {
      date: "2024-07-05",
      count: 3,
      level: 1,
    },
    {
      date: "2024-08-02",
      count: 16,
      level: 4,
    },
    {
      date: "2024-09-01",
      count: 16,
      level: 4,
    },
    {
      date: "2024-10-11",
      count: 12,
      level: 3,
    },
    {
      date: "2024-11-29",
      count: 11,
      level: 3,
    },
    {
      date: "2024-11-30",
      count: 9,
      level: 2,
    },
    {
      date: "2024-12-01",
      count: 11,
      level: 3,
    },
  ];

  return (
    <ActivityCalendar
      colorScheme={isDarkMode ? "dark" : "light"}
      data={data}
      loading={false}
      maxLevel={4}
      theme={{
        light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
      }}
      renderBlock={(block, activity) => (
        <Tooltip content={`${activity.count} activities on ${activity.date}`}>
          {block}
        </Tooltip>
      )}
      renderColorLegend={(block, level) => (
        <Tooltip content={`Level: ${level}`}>{block}</Tooltip>
      )}
    />
  );
};
