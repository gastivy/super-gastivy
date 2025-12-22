import { cva } from "class-variance-authority";

export const alertVariants = cva(
  `w-full flex justify-between items-center px-4 py-2.5 rounded-sm text-sm`,
  {
    variants: {
      variant: {
        success: "bg-green-100 text-green-500",
        warning: "bg-orange-100 text-orange-500",
        error: "bg-red-100 text-red-500",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);
