import { routes, ROUTES_UNPROTECTED } from "@constants/routes";
import { cookies } from "@libs/cookies";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

const RootLayout = () => <Outlet />;

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const token = cookies.isExists(import.meta.env.VITE_KEY_ACCESS_TOKEN);
    if (!token && !ROUTES_UNPROTECTED.includes(location.pathname)) {
      throw redirect({ to: routes.login.path });
    }
  },
  component: RootLayout,
});
