import { useRouterState } from "@tanstack/react-router";
import FinanceCategoriesList from "./FinanceCategoriesList";
import FinanceCategoriesForm from "./FinanceCategoriesForm";

const FinanceCategoriesContainer = () => {
  const routerState = useRouterState();
  const { categoryId, isCreated } = routerState.location.state;

  if (categoryId || isCreated) return <FinanceCategoriesForm />;
  return <FinanceCategoriesList />;
};

export default FinanceCategoriesContainer;
