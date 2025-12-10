import { createFileRoute } from "@tanstack/react-router";
import FinanceContainer from "@containers/finance";

const FinancePage = () => {
  return <FinanceContainer />;
};

export const Route = createFileRoute("/(app)/_layout/finance/")({
  component: FinancePage,
});
