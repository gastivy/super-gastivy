import React from "react";

import Spinner from "@components/base/Spinner";
import { cn } from "@libs/classnames";

import type { ButtonProps } from "./Button.types";
import { buttonVariants } from "./Button.variants";

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  shape,
  widthFull,
  isLoading,
  ...props
}) => (
  <button
    data-slot="button"
    className={cn(
      buttonVariants({ variant, shape, size, widthFull, className })
    )}
    {...props}
  >
    {isLoading ? (
      <div className="flex items-center gap-2">
        <Spinner className="w-4 h-4 fill-white" />
        <div>Loading...</div>
      </div>
    ) : (
      props.children
    )}
  </button>
);

export default Button;
