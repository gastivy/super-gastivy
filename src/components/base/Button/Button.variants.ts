import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  `w-max text-shark-700 inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all duration-300 ease-out whitespace-nowrap font-medium`,
  {
    variants: {
      variant: {
        primary:
          "border border-green-yellow-400 bg-green-yellow-400 hover:bg-green-yellow-300 disabled:bg-gray-200 disabled:border-gray-200",
        secondary:
          "border border-white bg-white shadow-sm hover:bg-gray-50 disabled:bg-gray-200 disabled:border-gray-200",
        outline:
          "border border-shark-700 shadow-xs hover:bg-shark-200 disabled:bg-gray-200 disabled:border-gray-200",
        text: "text-red-400 bg-red-50 hover:bg-red-100 disabled:bg-gray-200 disabled:border-gray-200",
      },
      size: {
        small: "text-xs px-2.5 py-1",
        regular: "text-sm px-5 py-1.5",
        large: "text-base px-6 py-2",
      },
      widthFull: {
        true: "w-full",
        false: "",
      },
      shape: {
        "semi-round": "rounded-sm",
        pill: "rounded-full min-w-20",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "regular",
      widthFull: false,
    },
  }
);
