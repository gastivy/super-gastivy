import ActivityCategoriesContainer from "@containers/activity-category";
import { createFileRoute } from "@tanstack/react-router";

const TimerActivityPage = () => {
  return <ActivityCategoriesContainer />;
};

export const Route = createFileRoute("/(app)/_layout/activity/categories/")({
  component: TimerActivityPage,
});
