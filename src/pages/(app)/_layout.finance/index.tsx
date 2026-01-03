import { createFileRoute } from "@tanstack/react-router";
import FinanceOverviewContainer from "@containers/finance-app/finance-overview";

const FinanceOverviewPage = () => {
  return <FinanceOverviewContainer />;
};

export const Route = createFileRoute("/(app)/_layout/finance/")({
  component: FinanceOverviewPage,
});
