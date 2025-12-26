import { useRouterState } from "@tanstack/react-router";
import ActivityLogs from "./ActivityLogs";
import ActivityLogForm from "./ActivityLogForm";

const ActivityLogContainer = () => {
  const routerState = useRouterState();
  const { activityLogId, isCreated } = routerState.location.state;

  if (activityLogId || isCreated) return <ActivityLogForm />;

  return <ActivityLogs />;
};

export default ActivityLogContainer;
