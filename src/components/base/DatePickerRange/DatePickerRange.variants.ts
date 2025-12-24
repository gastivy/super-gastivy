import { cva } from "class-variance-authority";

export const datePickerVariants = cva(
  "w-full border text-gray-900 placeholder-gray-400 focus:outline-none transition",
  {
    variants: {
      size: {
        small: "text-xs px-4 py-1",
        regular: "text-sm px-4 py-1.5",
        large: "text-base px-4 py-2",
      },
      shape: {
        square: "rounded-none",
        "semi-rounded": "rounded-md",
        pill: "rounded-full",
      },
      hasPrefix: {
        true: "pl-9",
        false: "",
      },
      hasSuffix: {
        true: "pr-9",
        false: "",
      },
      hasValue: {
        true: "border-shark-500",
        false: "",
      },
      error: {
        true: "border-red-500 focus:border-red-500",
        false: "border-gray-300 focus:border-green-yellow-500",
      },
    },
    defaultVariants: {
      size: "regular",
      shape: "square",
      hasPrefix: false,
      hasSuffix: false,
      hasValue: false,
      error: false,
    },
  }
);
