import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "~/common/trpc";

export const useGetStudyCalendarQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ["getStudyCalendar"],
    queryFn: () => {
      return trpcClient.loader.getStudyCalendar.query();
    },
    enabled,
  });
