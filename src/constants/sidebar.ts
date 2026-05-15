import type { ComponentType } from "react";

import {
  IconAlarm,
  IconBook,
  IconChartLine,
  IconCoins,
  IconDiamond,
  IconDropletHalf2Filled,
  IconFileDescription,
  IconHome,
  IconLayoutGrid,
  IconPencil,
  IconSettings,
  IconWallet,
} from "@tabler/icons-react";

import { routes } from "./routes";

export interface Menu {
  name: string;
  path: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export interface SidebarMenu extends Menu {
  children: Menu[];
}

export const SIDEBAR_MENU: SidebarMenu[] = [
  {
    name: "Activity",
    path: routes.activity.overview.path,
    icon: IconDropletHalf2Filled,
    children: [
      {
        name: "Overview",
        path: routes.activity.overview.path,
        icon: IconHome,
      },
      {
        name: "Timer",
        path: routes.activity.timer.path,
        icon: IconAlarm,
      },
      // {
      //   name: "Statistics",
      //   path: routes.activity.statistic.path,
      //   icon: IconChartLine,
      // },
      {
        name: "Logs",
        path: routes.activity.activityLog.path,
        icon: IconFileDescription,
      },
      {
        name: "Categories",
        path: routes.activity.categories.path,
        icon: IconLayoutGrid,
      },
    ],
  },
  {
    name: "Finance",
    path: routes.finance.home.path,
    icon: IconCoins,
    children: [
      {
        name: "Overview",
        path: routes.finance.home.path,
        icon: IconHome,
      },
      {
        name: "Statistic",
        path: routes.finance.statistic.path,
        icon: IconChartLine,
      },
      {
        name: "Wallet",
        path: routes.finance.wallet.path,
        icon: IconWallet,
      },
      {
        name: "Transaction",
        path: routes.finance.transactions.path,
        icon: IconFileDescription,
      },
      {
        name: "Categories",
        path: routes.finance.categories.path,
        icon: IconLayoutGrid,
      },
    ],
  },
  {
    name: "Portfolio",
    path: routes.portfolio.overview.path,
    icon: IconChartLine,
    children: [
      {
        name: "Overview",
        path: routes.portfolio.overview.path,
        icon: IconHome,
      },
      {
        name: "Stocks",
        path: routes.portfolio.stocks.path,
        icon: IconChartLine,
      },
      {
        name: "Crypto",
        path: routes.portfolio.crypto.path,
        icon: IconCoins,
      },
      {
        name: "Cash",
        path: routes.portfolio.cash.path,
        icon: IconWallet,
      },
      {
        name: "Gold",
        path: routes.portfolio.gold.path,
        icon: IconDiamond,
      },
    ],
  },
  {
    name: "Journal",
    path: routes.journaling.overview.path,
    icon: IconBook,
    children: [
      {
        name: "Overview",
        path: routes.journaling.overview.path,
        icon: IconHome,
      },
      {
        name: "New Entry",
        path: routes.journaling.create.path,
        icon: IconPencil,
      },
      {
        name: "Templates",
        path: routes.journaling.templates.path,
        icon: IconFileDescription,
      },
    ],
  },
  {
    name: "Settings",
    path: routes.settings.path,
    icon: IconSettings,
    children: [],
  },
];
