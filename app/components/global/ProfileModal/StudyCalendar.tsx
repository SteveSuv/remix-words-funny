import dayjs from "dayjs";
import { Tooltip } from "@heroui/react";
import { useAppTheme } from "~/hooks/useAppTheme";

type StudyRecord = {
  wordSlug: string;
  updatedAt: Date | string;
};

const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"];
const monthLabels = [
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
];

function getStudyDays(studyCalendar: StudyRecord[]) {
  const today = dayjs().startOf("day");
  const start = today.subtract(6, "month");
  const gridStart = start.subtract(start.day(), "day");
  const gridEnd = today.add(6 - today.day(), "day");
  const countByDate = new Map<string, number>();

  for (const { updatedAt } of studyCalendar) {
    const date = dayjs(updatedAt);
    if (
      !date.isValid() ||
      date.isBefore(start, "day") ||
      date.isAfter(today, "day")
    ) {
      continue;
    }

    const key = date.format("YYYY-MM-DD");
    countByDate.set(key, (countByDate.get(key) ?? 0) + 1);
  }

  const weekCount = Math.floor(gridEnd.diff(gridStart, "day") / 7) + 1;
  const weeks = Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const date = gridStart.add(weekIndex * 7 + weekday, "day");
      const key = date.format("YYYY-MM-DD");
      const count = countByDate.get(key) ?? 0;
      const level = count === 0 ? 0 : Math.min(Math.ceil(count / 10), 4);

      return {
        key,
        date,
        count,
        level,
        isInRange: !date.isBefore(start, "day") && !date.isAfter(today, "day"),
      };
    }),
  );

  const monthByWeek = new Map<number, string>();
  let month = start.startOf("month");
  while (!month.isAfter(today, "month")) {
    const monthAnchor = month.isSame(start, "month") ? start : month;
    const weekIndex = Math.floor(monthAnchor.diff(gridStart, "day") / 7);
    if (!monthByWeek.has(weekIndex)) {
      monthByWeek.set(weekIndex, monthLabels[month.month()]);
    }
    month = month.add(1, "month");
  }

  return {
    weeks,
    monthByWeek,
    totalCount: [...countByDate.values()].reduce(
      (total, count) => total + count,
      0,
    ),
  };
}

export function StudyCalendar({
  studyCalendar,
  isFetching,
}: {
  studyCalendar: StudyRecord[];
  isFetching: boolean;
}) {
  const { isDarkMode } = useAppTheme();
  const { weeks, monthByWeek, totalCount } = getStudyDays(studyCalendar);
  const colors = isDarkMode
    ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
    : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

  return (
    <section
      aria-label="近半年学习日历"
      className="flex flex-col gap-3 overflow-x-auto"
      style={{ opacity: isFetching ? 0.68 : 1 }}
    >
      <div className="grid w-max grid-cols-[20px_auto] gap-x-2">
        <div className="grid grid-rows-[20px_repeat(7,12px)] gap-y-1 text-xs text-muted">
          <span />
          {weekdayLabels.map((weekday) => (
            <span className="h-3 leading-3" key={weekday}>
              {weekday}
            </span>
          ))}
        </div>
        <div>
          <div className="mb-1 grid h-5 auto-cols-[12px] grid-flow-col gap-1 text-xs text-muted">
            {weeks.map((_, weekIndex) => (
              <span
                className="overflow-visible whitespace-nowrap"
                key={weekIndex}
              >
                {monthByWeek.get(weekIndex) ?? ""}
              </span>
            ))}
          </div>
          <div className="grid auto-cols-3 grid-flow-col grid-rows-7 gap-1">
            {weeks.map((week) =>
              week.map(({ key, date, count, level, isInRange }) => {
                const label =
                  date.format("YYYY年M月D日") + " · 学习 " + count + " 个单词";

                const className = "block size-3 rounded-md";
                const style = {
                  backgroundColor: isInRange ? colors[level] : "transparent",
                };

                if (isInRange && count > 0) {
                  return (
                    <Tooltip key={key} delay={0}>
                      <Tooltip.Trigger
                        aria-label={label}
                        className={className}
                        style={style}
                      />
                      <Tooltip.Content>{label}</Tooltip.Content>
                    </Tooltip>
                  );
                }

                return (
                  <span
                    aria-label={isInRange ? label : undefined}
                    className={className}
                    key={key}
                    style={style}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-sm text-muted">
        <span>近半年学习 {totalCount} 个单词</span>
        <span className="flex items-center gap-1.5">
          <span>少</span>
          {colors.map((color) => (
            <span
              aria-hidden="true"
              className="size-3 rounded-md"
              key={color}
              style={{ backgroundColor: color }}
            />
          ))}
          <span>多</span>
        </span>
      </div>
    </section>
  );
}
