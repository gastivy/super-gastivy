import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  "w-full h-28 border text-gray-900 placeholder-gray-400 text-sm py-2 px-3 focus:outline-none transition",
  {
    variants: {
      shape: {
        square: "rounded-none",
        "semi-rounded": "rounded-md",
        pill: "rounded-full",
      },
      error: {
        true: "border-red-500 focus:border-red-500",
        false: "border-gray-300 focus:border-brand-500",
      },
    },
    defaultVariants: {
      shape: "square",
      error: false,
    },
  }
);
