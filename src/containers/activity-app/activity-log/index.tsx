import { useRouterState } from "@tanstack/react-router";

import type { LogActivity } from "@modules/activity/activity-log/models";

import ActivityLogForm from "./ActivityLogForm";
import ActivityLogs from "./ActivityLogs";

const ActivityLogContainer = () => {
  const routerState = useRouterState();
  const { form, isCreated } = routerState.location.state || {};

  if ((form as LogActivity)?.id || isCreated) return <ActivityLogForm />;

  return <ActivityLogs />;
};

export default ActivityLogContainer;
