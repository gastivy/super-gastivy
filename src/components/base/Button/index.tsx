import React from "react";
import { buttonVariants } from "./Button.variants";
import type { ButtonProps } from "./Button.types";
import { cn } from "@libs/classnames";

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  shape,
  widthFull,
  ...props
}) => (
  <button
    data-slot="button"
    className={cn(
      buttonVariants({ variant, shape, size, widthFull, className })
    )}
    {...props}
  />
);

export default Button;
