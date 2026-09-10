import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { ActivityCalendar } from "react-activity-calendar";
import type { Activity } from "react-activity-calendar";
import { orpc } from "~/common/orpcClient";
import { isProfileModalOpenAtom } from "~/common/store";
import { useAppTheme } from "~/hooks/useAppTheme";

function getCalendarData(
  studyCalendar: {
    wordSlug: string;
    updatedAt: Date | string;
  }[] = [],
) {
  const end = dayjs().startOf("day");
  const start = end.subtract(6, "month").startOf("day");
  const countByDate = new Map<string, number>();

  studyCalendar.forEach(({ updatedAt }) => {
    const date = dayjs(updatedAt);
    if (!date.isValid()) return;

    const key = date.format("YYYY-MM-DD");
    countByDate.set(key, (countByDate.get(key) || 0) + 1);
  });

  const result: Activity[] = [];

  let currentDate = start;
  while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
    const date = currentDate.format("YYYY-MM-DD");
    const count = countByDate.get(date) || 0;
    const activity: Activity = { date, count: 0, level: 0 };

    if (count > 0) {
      const level = Math.min(Math.ceil(count / 10), 4);
      activity.count = count;
      activity.level = level;
    }
    result.push(activity);
    currentDate = currentDate.add(1, "day");
  }

  return result;
}

export function StudyCalendar() {
  const { isDarkMode } = useAppTheme();

  const isProfileModalOpen = useAtomValue(isProfileModalOpenAtom);

  const { data, isFetching } = useQuery(
    orpc.loader.getStudyCalendar.queryOptions({
      enabled: isProfileModalOpen,
      staleTime: 0,
    }),
  );

  const { studyCalendar = [] } = data || {};

  const calendarData = getCalendarData(studyCalendar);

  return (
    <ActivityCalendar
      colorScheme={isDarkMode ? "dark" : "light"}
      data={calendarData}
      blockRadius={0}
      maxLevel={4}
      style={{
        opacity: isFetching ? 0.68 : 1,
        transition: "opacity 120ms ease",
      }}
      theme={{
        light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
      }}
      labels={{
        months: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        weekdays: ["日", "一", "二", "三", "四", "五", "六"],
        totalCount: "近半年共学习 {{count}} 个单词",
        legend: { less: "低", more: "高" },
      }}
    />
  );
}
