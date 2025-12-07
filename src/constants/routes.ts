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
    home: {
      name: "Home",
      path: "/activity",
    },
    category: {
      name: "Category",
      path: "/activity/category",
    },
    statistic: {
      name: "Statistic",
      path: "/activity/statistic",
    },
    activityLog: {
      name: "Activity",
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
