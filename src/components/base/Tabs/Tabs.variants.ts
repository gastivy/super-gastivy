import { cva } from "class-variance-authority";

export const tabsVariants = cva(
  "group/tabs flex gap-2 data-horizontal:flex-col"
);

export const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-1 text-shark-700 group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-shark-700/5",
        line: "gap-1 bg-transparent rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const tabsTriggerVariants = cva(
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap text-shark-700/60 transition-all cursor-pointer hover:text-shark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "data-active:bg-white data-active:text-limed-spruce-900 data-active:shadow-sm",
        line: "data-active:bg-transparent data-active:text-shark-700 after:absolute after:bg-shark-700 after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 data-active:after:opacity-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
