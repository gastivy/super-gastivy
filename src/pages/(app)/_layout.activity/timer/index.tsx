import TimerActivityContainer from "@containers/activity-timer";
import { createFileRoute } from "@tanstack/react-router";

const TimerActivityPage = () => {
  return <TimerActivityContainer />;
};

export const Route = createFileRoute("/(app)/_layout/activity/timer/")({
  component: TimerActivityPage,
});
