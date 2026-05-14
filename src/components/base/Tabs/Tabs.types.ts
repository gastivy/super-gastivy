import type { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { VariantProps } from "class-variance-authority";

import type {
  tabsListVariants,
  tabsTriggerVariants,
  tabsVariants,
} from "./Tabs.variants";

export type TabsProps = TabsPrimitive.Root.Props &
  VariantProps<typeof tabsVariants>;

export type TabsListProps = TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants>;

export type TabsTriggerProps = TabsPrimitive.Tab.Props &
  VariantProps<typeof tabsTriggerVariants>;

export type TabsContentProps = TabsPrimitive.Panel.Props;
