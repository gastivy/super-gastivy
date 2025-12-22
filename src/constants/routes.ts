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
    category: {
      name: "Category",
      path: "/finance/category",
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
};

export const ROUTES_UNPROTECTED = [routes.login.path, routes.register.path];
