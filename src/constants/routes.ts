export const routes = {
  home: {
    name: "Home",
    path: "/",
  },
  login: {
    name: "Login",
    path: "/login",
  },
  register: {
    name: "Register",
    path: "/register",
  },
  activity: {
    overview: {
      name: "Overview",
      path: "/activity",
    },
    timer: {
      name: "Timer",
      path: "/activity/timer",
    },
    categories: {
      name: "Categories Activity",
      path: "/activity/categories",
    },
    statistic: {
      name: "Statistics",
      path: "/activity/statistics",
    },
    activityLog: {
      name: "Activity Logs",
      path: "/activity/log",
    },
  },
  finance: {
    home: {
      name: "Home",
      path: "/finance",
    },
    wallet: {
      name: "Wallet",
      path: "/finance/wallet",
    },
    categories: {
      name: "Categories Transaction",
      path: "/finance/categories",
    },
    statistic: {
      name: "Statistic",
      path: "/finance/statistic",
    },
    transactions: {
      name: "Transaction",
      path: "/finance/transactions",
    },
  },
  portfolio: {
    overview: {
      name: "Overview",
      path: "/portfolio/overview",
    },
    stocks: {
      name: "Stocks",
      path: "/portfolio/stocks",
    },
    crypto: {
      name: "Crypto",
      path: "/portfolio/crypto",
    },
    cash: {
      name: "Cash",
      path: "/portfolio/cash",
    },
    gold: {
      name: "Gold",
      path: "/portfolio/gold",
    },
  },
  journaling: {
    overview: {
      name: "Overview",
      path: "/journaling/overview",
    },
    create: {
      name: "New Journal",
      path: "/journaling/create",
    },
    detail: {
      name: "Journal Detail",
      path: "/journaling/$id",
    },
    templates: {
      name: "Templates",
      path: "/journaling/templates",
    },
  },
  settings: {
    name: "Settings",
    path: "/settings",
  },
};

export const ROUTES_UNPROTECTED = [routes.login.path, routes.register.path];
