import { createFileRoute } from "@tanstack/react-router";
import ActivityContainer from "@containers/activity";

const ActivityPage = () => {
  return <ActivityContainer />;
};

export const Route = createFileRoute("/(app)/_layout/activity/")({
  component: ActivityPage,
});
