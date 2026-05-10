import type { VariantProps } from "class-variance-authority";

import type { multiSelectVariants } from "./MultiSelect.variants";

export type Option = {
  label: string;
  value: string;
  [key: string]: unknown;
};

export interface MultiSelectProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "suffix" | "onSelect"
> {
  label?: string;
  size?: VariantProps<typeof multiSelectVariants>["size"];
  shape?: VariantProps<typeof multiSelectVariants>["shape"];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  options: Option[];
  value?: string[];
  placeholder?: string;
  wrapperClassName?: string;
  onSelect: (val: string[], option: Option) => void;
}
