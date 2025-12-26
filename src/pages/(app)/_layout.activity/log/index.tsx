import ActivityLogContainer from "@containers/activity-log";
import { createFileRoute } from "@tanstack/react-router";

const ActivityLogPage = () => {
  return <ActivityLogContainer />;
};

export const Route = createFileRoute("/(app)/_layout/activity/log/")({
  component: ActivityLogPage,
});
