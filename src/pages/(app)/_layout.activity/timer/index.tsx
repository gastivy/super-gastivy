import { createFileRoute } from "@tanstack/react-router";

import TimerActivityContainer from "@containers/activity-app/timer";

const TimerActivityPage = () => {
  return <TimerActivityContainer />;
};

export const Route = createFileRoute("/(app)/_layout/activity/timer/")({
  component: TimerActivityPage,
});
