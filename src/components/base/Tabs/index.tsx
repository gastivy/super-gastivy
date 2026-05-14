import React from "react";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@libs/classnames";

import type {
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
} from "./Tabs.types";
import { tabsListVariants, tabsTriggerVariants } from "./Tabs.variants";

const Tabs: React.FC<TabsProps> = ({
  className,
  value,
  onValueChange,
  defaultValue,
  ...props
}) => (
  <TabsPrimitive.Root
    value={value}
    onValueChange={onValueChange}
    defaultValue={defaultValue}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
);

const TabsList: React.FC<TabsListProps> = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn(tabsListVariants(), className)}
    {...props}
  />
);

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  className,
  value,
  ...props
}) => (
  <TabsPrimitive.Trigger
    value={value}
    className={cn(tabsTriggerVariants(), className)}
    {...props}
  />
);

const TabsContent: React.FC<TabsContentProps> = ({
  className,
  value,
  ...props
}) => (
  <TabsPrimitive.Content
    value={value}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none",
      className
    )}
    {...props}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
