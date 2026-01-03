import type { IconNames } from "@components/base/Icon/Icon.types";
import { routes } from "./routes";

export interface Menu {
  name: string;
  path: string;
  icon: IconNames;
}

export interface SidebarMenu extends Menu {
  children: Menu[];
}

export const SIDEBAR_MENU: SidebarMenu[] = [
  {
    name: "Activity",
    path: routes.activity.overview.path,
    icon: "Activity-solid",
    children: [
      {
        name: "Overview",
        path: routes.activity.overview.path,
        icon: "Home-solid",
      },
      {
        name: "Timer",
        path: routes.activity.timer.path,
        icon: "Alarm-solid",
      },
      // {
      //   name: "Statistics",
      //   path: routes.activity.statistic.path,
      //   icon: "Chart-solid",
      // },
      {
        name: "Logs",
        path: routes.activity.activityLog.path,
        icon: "Document-solid",
      },
      {
        name: "Categories",
        path: routes.activity.categories.path,
        icon: "Grid-solid",
      },
    ],
  },
  {
    name: "Finance",
    path: routes.finance.home.path,
    icon: "Coins-solid",
    children: [
      {
        name: "Overview",
        path: routes.finance.home.path,
        icon: "Home-solid",
      },
      {
        name: "Statistic",
        path: routes.finance.statistic.path,
        icon: "Chart-solid",
      },
      {
        name: "Wallet",
        path: routes.finance.wallet.path,
        icon: "Wallet-solid",
      },
      {
        name: "Transaction",
        path: routes.finance.transactions.path,
        icon: "Document-solid",
      },
      {
        name: "Categories",
        path: routes.finance.categories.path,
        icon: "Grid-solid",
      },
    ],
  },
];
