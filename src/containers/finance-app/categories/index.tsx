import { useRouterState } from "@tanstack/react-router";

import FinanceCategoriesForm from "./FinanceCategoriesForm";
import FinanceCategoriesList from "./FinanceCategoriesList";

const FinanceCategoriesContainer = () => {
  const routerState = useRouterState();
  const { categoryId, isCreated } = routerState.location.state;

  if (categoryId || isCreated) return <FinanceCategoriesForm />;
  return <FinanceCategoriesList />;
};

export default FinanceCategoriesContainer;
