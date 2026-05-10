import type { VariantProps } from "class-variance-authority";

import type { inputVariants } from "./InputPassword.variants";

export interface InputPasswordProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "suffix"
> {
  label?: string;
  size?: VariantProps<typeof inputVariants>["size"];
  shape?: VariantProps<typeof inputVariants>["shape"];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  onChangeInput?: (value: string) => void;
}
