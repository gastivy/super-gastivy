import { useRouterState } from "@tanstack/react-router";
import ActivityCategoryList from "./ActivityCategoryList";
import ActivityCategoryForm from "./ActivityCategoryForm";

const ActivityCategoriesContainer = () => {
  const routerState = useRouterState();
  const { categoryId, isCreated } = routerState.location.state;

  if (categoryId || isCreated) return <ActivityCategoryForm />;
  return <ActivityCategoryList />;
};

export default ActivityCategoriesContainer;
