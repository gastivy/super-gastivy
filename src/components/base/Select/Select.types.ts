import type { VariantProps } from "class-variance-authority";

import type { selectVariants } from "./Select.variants";

export type Option = {
  label: string;
  value: string | number;
  [key: string]: unknown;
};

export interface SelectProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "suffix" | "onSelect"
> {
  label?: string;
  value?: string | number;
  size?: VariantProps<typeof selectVariants>["size"];
  shape?: VariantProps<typeof selectVariants>["shape"];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  options: Option[];
  placeholder?: string;
  wrapperClassName?: string;
  onSelect: (val: string | number, option: Option) => void;
}
