import { cva } from "class-variance-authority";

export const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg bg-shark-700/5 p-1 text-shark-700"
);

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-limed-spruce-900 data-[state=active]:shadow-sm cursor-pointer"
);
