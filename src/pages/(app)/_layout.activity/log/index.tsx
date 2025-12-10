import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_layout/activity/log/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/activity/logs/"!</div>;
}
