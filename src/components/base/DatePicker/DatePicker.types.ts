import type { DateRange, Mode, PropsBase, PropsRange } from "react-day-picker";

export type DatePickerRangeProps = PropsBase &
  Omit<PropsRange, "onSelect"> & {
    mode?: Mode;
    showShortcut?: boolean;
    onSelect?: (range: DateRange | undefined) => void;
    onBlur?: () => void;
  };

export interface Range {
  start_date?: Date | undefined;
  end_date?: Date;
}

export interface ShortcutDate {
  name: string;
  value: string;
  range: Range;
}
