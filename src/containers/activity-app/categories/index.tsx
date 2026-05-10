import { useRouterState } from "@tanstack/react-router";

import ActivityCategoryForm from "./ActivityCategoryForm";
import ActivityCategoryList from "./ActivityCategoryList";

const ActivityCategoriesContainer = () => {
  const routerState = useRouterState();
  const { categoryId, isCreated } = routerState.location.state;

  if (categoryId || isCreated) return <ActivityCategoryForm />;
  return <ActivityCategoryList />;
};

export default ActivityCategoriesContainer;
