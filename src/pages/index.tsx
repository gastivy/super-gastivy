import { routes } from "@constants/routes";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const token = await cookieStore.get(import.meta.env.VITE_KEY_ACCESS_TOKEN);
    if (token) {
      throw redirect({ to: routes.activity.overview.path });
    } else {
      throw redirect({ to: routes.login.path });
    }
  },
});

function RouteComponent() {
  return <div className="">Hello "/"!</div>;
}
