import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  `w-max text-slate-700 dark:text-slate-300 inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all duration-300 ease-out whitespace-nowrap font-medium`,
  {
    variants: {
      variant: {
        primary:
          "border border-brand-400 bg-brand-400 hover:bg-brand-300 dark:hover:bg-brand-500 text-zinc-950 disabled:bg-zinc-200 disabled:border-zinc-200 disabled:dark:bg-zinc-700 disabled:dark:border-zinc-700",
        secondary:
          "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:bg-zinc-200 disabled:border-zinc-200 disabled:dark:bg-zinc-700 disabled:dark:border-zinc-700",
        outline:
          "border border-slate-700 dark:border-slate-500 shadow-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:bg-zinc-200 disabled:border-zinc-200 disabled:dark:bg-zinc-700 disabled:dark:border-zinc-700",
        text: "text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:bg-zinc-200 disabled:border-zinc-200",
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
