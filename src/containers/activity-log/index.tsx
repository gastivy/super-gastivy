import { useRouterState } from "@tanstack/react-router";
import ActivityLogs from "./ActivityLogs";
import ActivityLogForm from "./ActivityLogForm";
import type { LogActivity } from "@modules/activity/activity-log/models";

const ActivityLogContainer = () => {
  const routerState = useRouterState();
  const { form, isCreated } = routerState.location.state || {};

  if ((form as LogActivity)?.id || isCreated) return <ActivityLogForm />;

  return <ActivityLogs />;
};

export default ActivityLogContainer;
