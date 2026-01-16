import type { PropsBase } from "react-day-picker";

export type DatePickerRangeProps = PropsBase & {
  label?: string;
  value: Date | undefined;
  mode?: "single";
  error?: string;
  wrapperClassName?: string;
  placeholder?: string;
  onBlur?: () => void;
  onSelect?: (date: Date | undefined) => void;
};
