import type { VariantProps } from "class-variance-authority";

import type { inputVariants } from "./InputText.variants";

export interface InputTextProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "suffix"
> {
  label?: string;
  size?: VariantProps<typeof inputVariants>["size"];
  shape?: VariantProps<typeof inputVariants>["shape"];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string | boolean;
  wrapperClassName?: string;
  onChangeInput?: (value: string) => void;
}
