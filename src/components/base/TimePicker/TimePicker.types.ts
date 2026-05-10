import type { VariantProps } from "class-variance-authority";

import type { timePickerVariants } from "./TimePicker.variants";

export type TimerPickerProps = {
  label?: string;
  value?: string; // "HH:mm"
  error?: string;
  size?: VariantProps<typeof timePickerVariants>["size"];
  shape?: VariantProps<typeof timePickerVariants>["shape"];
  className?: string;
  wrapperClassName?: string;
  onChange?: (value: string) => void;
};
