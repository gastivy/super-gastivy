import { createFileRoute } from "@tanstack/react-router";

import ActivityCategoriesContainer from "@containers/activity-app/categories";

const TimerActivityPage = () => {
  return <ActivityCategoriesContainer />;
};

export const Route = createFileRoute("/(app)/_layout/activity/categories/")({
  component: TimerActivityPage,
});
