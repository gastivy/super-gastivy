import { createFileRoute } from "@tanstack/react-router";
import ActivityOverviewContainer from "@containers/activity-app/overview";

const ActivityOverviewPage = () => {
  return <ActivityOverviewContainer />;
};

export const Route = createFileRoute("/(app)/_layout/activity/")({
  component: ActivityOverviewPage,
});
