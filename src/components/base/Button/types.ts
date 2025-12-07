import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "./variants";

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
