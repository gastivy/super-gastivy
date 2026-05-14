import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

import { routes, ROUTES_UNPROTECTED } from "@constants/routes";
import { ThemeProvider } from "@hooks/useTheme";
import { cookies } from "@libs/cookies";

const RootLayout = () => (
  <ThemeProvider>
    <Outlet />
  </ThemeProvider>
);

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const token = cookies.isExists(import.meta.env.VITE_KEY_ACCESS_TOKEN);
    if (!token && !ROUTES_UNPROTECTED.includes(location.pathname)) {
      throw redirect({ to: routes.login.path });
    }
  },
  component: RootLayout,
});
