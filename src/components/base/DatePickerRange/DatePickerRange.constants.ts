import { dateTime } from "@libs/dateTime";
import type { ShortcutDate } from "./DatePickerRange.types";

const today = new Date();
const ONE_DAY = 24 * 60 * 60 * 1000;

export const shortcutDate: ShortcutDate[] = [
  { name: "All", value: "all", range: {} },
  {
    name: "Yesterday",
    value: "yesterday",
    range: dateTime.getRangeDaily(new Date(today.getTime() - ONE_DAY)),
  },
  {
    name: "Today",
    value: "today",
    range: dateTime.getRangeDaily(new Date(today.getTime())),
  },
  {
    name: "Tomorrow",
    value: "tomorrow",
    range: dateTime.getRangeDaily(new Date(today.getTime() + ONE_DAY)),
  },
  {
    name: "7 Days ago",
    value: "7-days-ago",
    range: dateTime.getRangeWeekly(today, "previous"),
  },
  {
    name: "Weekly",
    value: "weekly",
    range: dateTime.getRangeWeekly(today, "current"),
  },
  {
    name: "7 Days Later",
    value: "7-days-later",
    range: dateTime.getRangeWeekly(today, "next"),
  },
  {
    name: "Monthly",
    value: "month",
    range: dateTime.getRangeThisMonth(),
  },
  {
    name: "Yearly",
    value: "year",
    range: dateTime.getRangeThisYear(),
  },
];
