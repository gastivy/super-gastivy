import { createFileRoute } from "@tanstack/react-router";
import FinanceCategoriesContainer from "@containers/finance-app/categories";

const FinanceCategoriesPage = () => {
  return <FinanceCategoriesContainer />;
};

export const Route = createFileRoute("/(app)/_layout/finance/categories/")({
  component: FinanceCategoriesPage,
});
